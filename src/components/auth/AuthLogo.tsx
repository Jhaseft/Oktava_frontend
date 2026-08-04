import { Image } from 'react-native';

const logoImg = require('../../../assets/Logoweb.png');

export function AuthLogo() {
  return (
    <Image
      source={logoImg}
      style={{ width: 180, height: 45, alignSelf: 'center' }}
      resizeMode="contain"
    />
  );
}
 