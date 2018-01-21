'use strict';

const ExtractTextPlugin = require('extract-text-webpack-plugin');
const OptimizeCssAssetsPlugin = require('optimize-css-assets-webpack-plugin');

module.exports = function (isDevelopment, paths) {
  return {
    module: {
      rules: [
        {
          test: /\.scss$/,
          include: paths,
          use: ExtractTextPlugin.extract({
            publicPath: '../../',
            fallback: 'style-loader',
            use: ['css-loader', 'postcss-loader', 'sass-loader']
          })
        },
        {
          test: /\.css$/,
          include: paths,
          use: ExtractTextPlugin.extract({
            fallback: 'style-loader',
            use: ['css-loader', 'postcss-loader']
          })
        }
      ]
    },
    plugins:
      isDevelopment === 'development'
        ? [new ExtractTextPlugin('assets/styles/style.[contenthash:8].css')]
        : [
          new ExtractTextPlugin('assets/styles/style.[contenthash:8].css'),
          new OptimizeCssAssetsPlugin({
            cssProcessorOptions: {
              discardComments: {
                removeAll: true
              },
              safe: true,
              map: { inline: false }
            }
          })
        ]
  };
};
