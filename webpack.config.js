const path = require('path');
// const UglifyJSPlugin = require('uglifyjs-webpack-plugin');
const webpack = require('webpack');

module.exports = {
  target: 'web',
  entry: './neonion-rest.js',
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'neonion-rest.bundle.js'
  },
  module: {
    rules: [
      // {
      //   test: /\.js$/,
      //   exclude: /(node_modules)/,
      //   use: {
      //     loader: 'babel-loader',
      //     options: {
      //       babelrc: true
      //     }
      //   }
      // },

    ]
  },
  plugins: [
    // new webpack.LoaderOptionsPlugin({
    //   minimize: true,
    //   debug: false
    // }),

  ],
};
0
