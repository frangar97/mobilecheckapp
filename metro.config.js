const {getDefaultConfig, mergeConfig} = require('@react-native/metro-config');

/**
 * Metro configuration
 * https://reactnative.dev/docs/metro
 *
 * @type {import('@react-native/metro-config').MetroConfig}
 */
const config = {
    resolver: {
      // Configuración de alias
      alias: {
        "@components": "./src/components",
        "@constants": "./src/constants",
        "@screens": "./src/screens",
        "@navigation": "./src/navigation",
        "@assets": "./src/assets",
        "@store": "./src/store",
      },
      // Agregar soporte para SVG
      // assetExts: getDefaultConfig(__dirname).resolver.assetExts.filter(ext => ext !== 'svg'),
      // sourceExts: [...getDefaultConfig(__dirname).resolver.sourceExts, 'svg'],
    },
  //   transformer: {
  //     babelTransformerPath: require.resolve('react-native-svg-transformer'),
  //   },
  };

module.exports = mergeConfig(getDefaultConfig(__dirname), config);
