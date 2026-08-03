import type { ImageSourcePropType } from 'react-native';
 
// Imágenes del carrusel promocional del Home (arriba del banner de horario).
//
// Para agregar más banners:
//   1) Copia la imagen a assets/ (o assets/banners/), con la extensión en
//      MINÚSCULA (.png / .jpg) — Metro no resuelve .PNG en mayúscula.
//   2) Agrégala a este arreglo con require('../../assets/tuimagen.png').
//
// Ideal: imágenes horizontales (~1.6:1) para que se vean como el hero.
export const HOME_BANNERS: ImageSourcePropType[] = [
  require('../../assets/Bannerpollo01.png'),
  require('../../assets/BannerPedidos.png'),
  require('../../assets/Bannerpollo01.png'),
  require('../../assets/DSC00104.JPG.jpeg'),
];
