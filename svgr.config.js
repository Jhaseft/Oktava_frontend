// Configuración de SVGR usada por react-native-svg-transformer (metro.config.js).
// Objetivo: aceptar SVGs exportados de Illustrator tal cual —con <style>.stX{fill:#000}
// y class="stX"— y hacer que su color sea `currentColor`, así el prop `color` los tiñe.
//
// Pipeline svgo: inlineStyles (mete el CSS en cada elemento) → convertStyleToAttrs
// (style="fill:#000" → fill="#000") → convertColors currentColor (fill="#000" →
// fill="currentColor") → removeStyleElement (limpia el <style> vacío).
//
// Nota: al cambiar esto hay que reiniciar Metro con caché limpia: `npx expo start -c`.
module.exports = {
  svgoConfig: {
    plugins: [
      {
        name: 'preset-default',
        params: {
          overrides: {
            inlineStyles: { onlyMatchedOnce: false },
            convertColors: false,
            removeViewBox: false,
            removeUnknownsAndDefaults: false,
          },
        },
      },
      'convertStyleToAttrs',
      { name: 'convertColors', params: { currentColor: true } },
      'removeStyleElement',
    ],
  },
};
