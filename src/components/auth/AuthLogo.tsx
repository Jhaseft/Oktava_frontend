import { Image } from 'react-native';

const logoImg = require('../../../assets/Logoiconoweb.png1');

export function AuthLogo() {
  return (
    <Image
      source={logoImg}
      style={{ width: 180, height: 45, alignSelf: 'center' }}
      resizeMode="contain"
    />
  );
}
 