'use strict';

const UglifyJSPlugin = require('uglifyjs-webpack-plugin');

module.exports = function (isDevelopment) {
  return {
    module: {
      loaders: [
        {
          test: /\.(js|jsx)$/,
          loader: 'imports?define=>false'
        }
      ],
      rules: [
        {
          test: /\.(js|jsx)$/,
          exclude: /node_modules/,
          loader: 'babel-loader'
        }
      ]
    },
    plugins:
      isDevelopment === 'development'
        ? []
        : [new UglifyJSPlugin({ sourceMap: true })]
  };
};
