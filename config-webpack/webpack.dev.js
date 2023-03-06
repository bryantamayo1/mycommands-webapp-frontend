const { merge } = require("webpack-merge")
const common = require('./webpack.common');
const webpack  = require('webpack');
const Dotenv = require('dotenv-webpack');
const path = require('path');
const glob = require('glob');
const HtmlWebpackPlugin = require('html-webpack-plugin');

/** @type {import('webpack').Configuration} */
module.exports = {
    entry: "./src/js/index.js",
    // entry: {
    //   "src/js/index.js": "./src/js/index"
    // },
  //   entry: glob.sync('./src/js/index.js').reduce((acc, myPath) => {
  //     console.log("myPath: ", myPath);
  //     console.log("acc: ", acc);
  //     const entry = myPath.replace('/index.js', 'index')
  //     acc[myPath] = myPath
  //     return acc
  // }, {}),
  // output: {
  //     path: path.resolve(__dirname, '../build'),
  //     filename: "[name].js",
  //     clean: true
  // },
  module: {
      rules: [
          {
              test: /\.html$/i,
              loader: "html-loader",
          },
          {
              test: /\.m?js$/,
              include: path.resolve(__dirname, '../src/js'),
              exclude: /node_modules/,
              use: {
                  loader: "babel-loader",
                  options: {
                      presets: [
                          ['@babel/preset-env', { targets: "defaults" }]
                      ]
                  }
                  }
          },
          {
            test: /\.css$/i,
            use: ['style-loader', 'css-loader', 'postcss-loader']
          },
          // {
          //     test: /\.css$/i,
          //     use: [devMode? 'style-loader': MiniCssExtractPlugin.loader, 'css-loader', 'postcss-loader']
          // },
          {
              type: "asset/resource",
              test: /\.(jpg|jpeg|png|gif|svg|ico)$/i
          },
          {
              test: /\.(woff(2)?|eot|ttf|otf|svg|)$/,
              type: 'asset/inline',
          }
      ]
  },
    mode: 'development',
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
      }),
      new HtmlWebpackPlugin({
        // filename: 'index.html',
        template: './src/index.html'
    }),
    ]
}

// module.exports = merge(common, dev);