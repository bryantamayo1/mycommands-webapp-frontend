const { merge } = require("webpack-merge")
const common = require('./webpack.common');
const webpack  = require('webpack');
const CssMinimizerPlugin = require('css-minimizer-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const TerserPlugin = require("terser-webpack-plugin");
const CopyPlugin = require("copy-webpack-plugin");
const Dotenv = require('dotenv-webpack');
var path = require('path');

/** @type {import('webpack').Configuration} */
const prod = {
    mode: 'production',
    module: {
        rules: [
          {
            test: /\.css$/i,
            use: [MiniCssExtractPlugin.loader, 'css-loader', 'postcss-loader']
        },
        ]
    },
    // devtool: 'source-map' // It's recommended
    optimization: {
        minimize: true,
        minimizer: [
            new CssMinimizerPlugin({
                minimizerOptions: {
                    preset: [
                        "default",
                        {
                            discardComments: {removeAll: true}
                        }
                    ]
                }
            }),
            new TerserPlugin({
                terserOptions: {
                  format: {
                    comments: false,
                  },
                },
                extractComments: false,
              }),
        ],
        // runtimeChunk: {
        //     name: 'runtime',
        // },
        runtimeChunk: {
            name: entrypoint => `runtimechunk~${entrypoint.name}`
         },
        // splitChunks: {
        //     chunks: "all"       // Se genera los .map correspondientes, se aconseja no subirlos a prod
        // }
    },
    plugins:[
        new MiniCssExtractPlugin({
            filename: '[name].[contenthash].css'
        }),
        // Copy all files of files-to-build folder inside build folder
        new CopyPlugin ({
            patterns: [
                { from: './files-to-build', to: './' }
            ]
        }),
        new Dotenv({
            path: path.join(__dirname, "../.env.production.local")
          })
    ]
}

module.exports = merge(common, prod);