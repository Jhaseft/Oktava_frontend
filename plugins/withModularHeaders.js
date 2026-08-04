const { withDangerousMod } = require('@expo/config-plugins');
const fs = require('fs');
const path = require('path');

// GoogleSignIn arrastra AppCheckCore (pod Swift) que depende de estos pods, que NO
// definen módulos. Al compilar como static library, CocoaPods necesita que estos
// generen modular headers para poder importarlos desde Swift. Los declaramos con
// :modular_headers => true en el Podfile generado por el prebuild.
const PODS_NEEDING_MODULAR_HEADERS = ['GoogleUtilities', 'RecaptchaInterop'];

module.exports = function withModularHeaders(config) {
  return withDangerousMod(config, [
    'ios',
    (cfg) => {
      const podfilePath = path.join(cfg.modRequest.platformProjectRoot, 'Podfile');
      let contents = fs.readFileSync(podfilePath, 'utf8');

      const linesToAdd = PODS_NEEDING_MODULAR_HEADERS.filter(
        (name) => !contents.includes(`pod '${name}', :modular_headers => true`),
      ).map((name) => `  pod '${name}', :modular_headers => true`);

      if (linesToAdd.length > 0) {
        contents = contents.replace(
          /(target ['"][^'"]+['"] do\n)/,
          `$1${linesToAdd.join('\n')}\n`,
        );
        fs.writeFileSync(podfilePath, contents);
      }

      return cfg;
    },
  ]);
};
