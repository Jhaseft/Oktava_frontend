# Oktava Frontend — convenciones

## Arquitectura: pantallas = orquestadores (NADA de "código chorizo")
De aquí en adelante, **siempre** modularizar. Prohibido meter estado + red + lógica + UI en un solo archivo largo.
- **Pantallas (`app/**`)**: orquestadores **delgados**. Solo componen componentes y consumen hooks. Nada de `fetch`, geocoding, ni estado complejo inline. Idealmente el `return` arma componentes y poco más.
- **Lógica y estado → hooks** en `src/hooks/` (ej. `useAddressManager`). Un hook por dominio/flujo; expone `{ estado, handlers }`. La pantalla llama al hook y reparte props.
- **UI → componentes chicos** en `src/components/<dominio>/`. Cada vista/bloque es su propio componente reutilizable (ej. `AddressListView`, `AddressMapPicker`, `AddressDetailsForm`).
- **Datos/red → servicios** en `src/services/` (nunca `fetch` directo en pantallas/componentes; reutilizar el service existente o crear uno).
- **Tipos → `src/types/`** y reutilizarlos. Nada de `any` ni tipos duplicados inline.
- **Regla práctica:** si una pantalla mezcla estado + red + varias vistas, o pasa de ~120 líneas, hay que partirla en hook(s) + componentes.

## Estilos: usar Tailwind (NativeWind) SIEMPRE
- Todo lo que se escriba o edite en este proyecto debe estilizarse con **NativeWind (Tailwind)** vía la prop `className`, no con `StyleSheet` ni objetos `style` en línea.
- Usar `style` solo para lo que Tailwind no puede expresar: valores dinámicos calculados (dimensiones, animaciones), props que no aceptan `className` (p. ej. `color`/`fill` de `Ionicons` y `react-native-svg`), o interpolaciones en runtime.
- Colores condicionales (estado activo/inactivo, etc.) se resuelven con `className` condicional.
- Al tocar un componente existente con `style`, migrarlo a `className` en la medida de lo razonable.

## Interfaz clara: fondo blanco + negro + rojo elegante
La app usa una interfaz **clara**. Regla general:
- **Fondo:** blanco (`#ffffff` / `bg-white`). Superficies sutiles: `#f6f6f6` (`bg-brand-surface`).
- **Detalles / texto principal:** negro elegante `#141414` (`text-brand-black`). Texto secundario: `#6b6b6b` (`text-brand-muted`).
- **Acento:** rojo elegante `#c1121f` (`text-brand-red` / `bg-brand-red`). Variante oscura: `#8d0e17` (`brand-reddark`).
- **Bordes / divisores:** `#e6e6e6` (`border-brand-border`).
- No usar fondos negros ni texto blanco salvo sobre superficies rojas/negras intencionales (p. ej. un botón rojo con texto blanco).
- Los tokens viven en [src/theme/theme.ts](src/theme/theme.ts) (`colors`, `fonts`) y como utilidades Tailwind `brand-*`. Preferir las utilidades `brand-*` en `className`; usar el objeto `colors` solo para props que no aceptan `className` (iconos, svg).

## No comentar dentro del `return` (JSX)
- **Prohibido** usar comentarios JSX `{/* ... */}` dentro del `return` / del árbol renderizado.
- Si un bloque necesita explicación, poné el comentario normal (`//`) **antes** del `return` o arriba de la constante/función, no entre los elementos.
- El JSX debe quedar limpio: solo lo que se renderiza.

## Tipografía: Lemon Milk SIEMPRE
- La fuente de la app es **Lemon Milk** (https://www.dafont.com/es/lemon-milk.font), cargada con `expo-font` en [app/_layout.tsx](app/_layout.tsx) y registrada en Tailwind.
- Aplicar con `className`: `font-lemon` (regular), `font-lemon-medium`, `font-lemon-bold`, `font-lemon-light`. Para props sin `className`, usar `fonts` de `src/theme/theme.ts`.
- Todo `Text` visible debe llevar una familia `font-lemon*`. Por defecto usar `font-lemon`; títulos/acentos en `font-lemon-bold`.
- Lemon Milk es un display geométrico (tiende a mayúsculas): para títulos suele ir bien `uppercase`.
- Los archivos de fuente van en `assets/fonts/` (ver `assets/fonts/README.md`).
