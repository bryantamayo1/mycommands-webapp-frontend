const { merge } = require("webpack-merge")
const common = require('./webpack.common');
const webpack  = require('webpack');
const Dotenv = require('dotenv-webpack');
var path = require('path');

/** @type {import('webpack').Configuration} */
const dev = {
    mode: 'development',
    module: {
      rules: [
        {
          test: /\.css$/i,
          use: ['style-loader', 'css-loader', 'postcss-loader']
        }
      ]
    },
    devServer: {
        compress: true,
        static: {
          directory: path.join(__dirname, '../src'),
        },
        port: 3010,
      },
    // target: "web", // Ignora browserslist de package.json
    devtool: "eval-source-map",
    // devtool: "eval",
    plugins:[
      new Dotenv({
        path: path.join(__dirname, "../.env.development.local")
      })
    ]
}

module.exports = merge(common, dev);