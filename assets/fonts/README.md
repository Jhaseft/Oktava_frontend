# Fuente Lemon Milk

La app usa **Lemon Milk** como tipografía principal.
Descárgala de: https://www.dafont.com/es/lemon-milk.font

## Qué hacer

Reemplaza los archivos placeholder de esta carpeta por los reales del ZIP de dafont,
respetando EXACTAMENTE estos nombres (así los `require(...)` de `app/_layout.tsx` los encuentran):

- `LEMONMILK-Regular.otf`
- `LEMONMILK-Medium.otf`
- `LEMONMILK-Bold.otf`
- `LEMONMILK-Light.otf`

> El ZIP de dafont trae estos mismos nombres. Si alguna variante no viene incluida,
> duplica `LEMONMILK-Regular.otf` con el nombre faltante para que el bundler no falle.

Mientras sean placeholders, la app arranca igual pero usa la fuente del sistema
(la carga de fuente falla en silencio, no bloquea el arranque). Al poner los
archivos reales, la tipografía Lemon Milk aparece automáticamente.
