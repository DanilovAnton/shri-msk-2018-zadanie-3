'use strict';

module.exports = function () {
  return {
    module: {
      rules: [
        {
          test: /\.(jpg|png|svg)$/,
          loader: 'file-loader',
          options: {
            name: './assets/images/[name].[hash:8].[ext]'
          }
        }
      ]
    }
  };
};
