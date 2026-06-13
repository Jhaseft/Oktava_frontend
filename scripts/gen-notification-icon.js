/* eslint-disable */
// Genera assets/notification-icon.png: silueta BLANCA sobre fondo TRANSPARENTE,
// a partir de assets/logo.png (corona+P blanca sobre negro).
// Uso: node scripts/gen-notification-icon.js
const Jimp = require('jimp');
const path = require('path');

const SRC = path.join(__dirname, '..', 'assets', 'logo.png');
const OUT = path.join(__dirname, '..', 'assets', 'notification-icon.png');
const SIZE = 96; // tamaño recomendado por Expo para el ícono de notificación

(async () => {
  const img = await Jimp.read(SRC);

  // Negro -> transparente, todo lo demás -> blanco (alpha = luminancia original).
  img.scan(0, 0, img.bitmap.width, img.bitmap.height, function (x, y, idx) {
    const r = this.bitmap.data[idx];
    const g = this.bitmap.data[idx + 1];
    const b = this.bitmap.data[idx + 2];
    const lum = Math.round((r + g + b) / 3);
    this.bitmap.data[idx] = 255;
    this.bitmap.data[idx + 1] = 255;
    this.bitmap.data[idx + 2] = 255;
    this.bitmap.data[idx + 3] = lum; // bordes antialiased se mantienen suaves
  });

  // Recorta el margen transparente para que la silueta quede lo más grande posible.
  img.autocrop({ tolerance: 0.01, cropOnlyFrames: false });

  // Lo coloca centrado en un lienzo cuadrado con ~10% de padding y escala a 96x96.
  const glyph = Math.max(img.bitmap.width, img.bitmap.height);
  const canvasSize = Math.round(glyph * 1.18);
  const canvas = new Jimp(canvasSize, canvasSize, 0x00000000);
  canvas.composite(
    img,
    Math.round((canvasSize - img.bitmap.width) / 2),
    Math.round((canvasSize - img.bitmap.height) / 2),
  );
  canvas.resize(SIZE, SIZE, Jimp.RESIZE_BICUBIC);

  await canvas.writeAsync(OUT);
  console.log('OK ->', OUT, `(${SIZE}x${SIZE} RGBA)`);
})().catch((e) => {
  console.error(e);
  process.exit(1);
});
