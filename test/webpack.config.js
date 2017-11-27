const path = require('path');
// const UglifyJSPlugin = require('uglifyjs-webpack-plugin');
const webpack = require('webpack');

module.exports = {
  target: 'web',
  entry: './test/index.js',
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'index.bundle.js',
    library: 'NeonionRest',
    libraryTarget: 'umd',
    umdNamedDefine: true
  },
  module: {
    // rules: [
    //   {
    //     test: /\.js$/,
    //     exclude: /(node_modules)/,
    //     use: {
    //       loader: 'babel-loader',
    //       options: {
    //         presets: ['stage-2']
    //       }
    //     }
    //   },
    //
    // ]
  },
  plugins: [
    // new webpack.LoaderOptionsPlugin({
    //   minimize: true,
    //   debug: false
    // }),

  ],
};
