'use strict';

module.exports = function () {
  return {
    module: {
      rules: [
        {
          test: /\.(ttf|otf)$/,
          loader: 'file-loader',
          options: {
            name: './assets/fonts/[name].[ext]'
          }
        }
      ]
    }
  };
};
