'use strict'

const path = require('path');
const { VueLoaderPlugin } = require('vue-loader');
// const CopyWebpackPlugin = require('copy-webpack-plugin')
const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
  mode: 'development',
  entry: [
    './src/main.ts'
  ],
  module: {
    rules: [
      {
        test: /\.vue$/,
        use: 'vue-loader'
      },
      {
          test: /\.tsx?$/,
          use: 'ts-loader'
      },
      {
          test: /\.css$/,
          use: 'css-loader'
      }
    ]
  },
  resolve: {
    extensions: ['.ts', '.js', '.vue', '.json'],
  },
  devServer: {
    contentBase: path.join(__dirname, 'dist'),
    compress: true,
    port: 9000
  },
  plugins: [
    new VueLoaderPlugin(),
    new HtmlWebpackPlugin({
      filename: 'public/index.html'
    })
    // new CopyWebpackPlugin([
    //   { from: 'public/index.html', to: './' },
    //   { from: 'public/favicon.ico', to: './' }
    // ])
  ]
}