'use strict';

const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CleanWebpackPlugin = require('clean-webpack-plugin');
const merge = require('webpack-merge');

const style = require('./webpack/style');
const image = require('./webpack/image');
const javascript = require('./webpack/javascript');
const font = require('./webpack/font');

const PATHS = {
  source: path.join(__dirname, 'resources'),
  build: path.join(__dirname, 'public')
};
const isDevelopment = process.env.NODE_ENV;

const common = merge([
  {
    devtool:
      isDevelopment === 'development' ? 'inline-source-map' : 'source-map',
    entry: [PATHS.source + '/pages/index.js'],
    output: {
      path: PATHS.build,
      filename: 'assets/scripts/bundle.[hash:8].js',
      publicPath: '/'
    },
    plugins: [
      new CleanWebpackPlugin('public'),
      new HtmlWebpackPlugin({
        filename: 'index.html',
        template: PATHS.source + '/pages/index.html'
      })
    ]
  },
  style(isDevelopment),
  image(),
  font(),
  javascript(isDevelopment)
]);

module.exports = (function () {
  return common;
})();
