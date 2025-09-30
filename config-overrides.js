const webpack = require('webpack');

module.exports = function override(config) {
  // Configuración básica - solo lo esencial para Solana
  config.resolve.fallback = {
    crypto: require.resolve('crypto-browserify'),
    stream: require.resolve('stream-browserify'),
    vm: require.resolve('vm-browserify'),
  };
  
  config.plugins = (config.plugins || []).concat([
    new webpack.ProvidePlugin({
      process: require.resolve('process/browser.js'),
      Buffer: ['buffer', 'Buffer'],
    }),
  ]);

  // Solo eliminar source-map-loader para reducir warnings
  config.module.rules = config.module.rules.filter(
    rule => !(rule.loader && rule.loader.includes('source-map-loader'))
  );

  return config;
};
