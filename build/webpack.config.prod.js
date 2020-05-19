'use strict'
const utils = require('./utils')

const path = require('path'),
    HtmlWebpackPlugin = require('html-webpack-plugin'),
    {
        CleanWebpackPlugin
    } = require('clean-webpack-plugin'),
    {
        VueLoaderPlugin
    } = require('vue-loader'),
    CopyWebpackPlugin = require('copy-webpack-plugin'),
    webpack = require('webpack')

module.exports = {
    mode: 'development',
    entry: {
        app: './finelets/app.js'
    },
    output: {
        filename: '[name].[contenthash].js',
        path: path.resolve(__dirname, 'dist'),
    },
    module: {
        rules: [{
                test: /\.vue$/,
                use: 'vue-loader'
            },
            {
                test: /\.css$/,
                use: [
                    'vue-style-loader',
                    'css-loader'
                ]
            },
            {
                test: /\.styl(us)?$/,
                use: [
                    'vue-style-loader',
                    'css-loader',
                    'stylus-loader'
                ]
            },
            {
                test: /\.(png|jpe?g|gif|svg)(\?.*)?$/,
                loader: 'url-loader',
                options: {
                    limit: 10000,
                    esModule: false,
                    name: utils.assetsPath('img/[name].[ext]')
                }
            },
            {
                test: /\.(mp4|webm|ogg|mp3|wav|flac|aac)(\?.*)?$/,
                loader: 'url-loader',
                options: {
                    limit: 10000,
                    name: utils.assetsPath('media/[name].[hash:7].[ext]')
                }
            },
            {
                test: /\.(woff2?|eot|ttf|otf)(\?.*)?$/,
                loader: 'url-loader',
                options: {
                    limit: 10000,
                    name: utils.assetsPath('fonts/[name].[hash:7].[ext]')
                }
            }
        ]
    },
    plugins: [
        new VueLoaderPlugin(),
        new CleanWebpackPlugin(),
        new HtmlWebpackPlugin({
            title: '纺织品自动化疵点检测操作系统',
            template: 'index.html'
        }),
        new CopyWebpackPlugin([{
            from: utils.resolve('finelets/static/img'),
            to: utils.assetsPath('img'),
            toType: 'dir'
        }]),
        new webpack.DefinePlugin({
            'process.env': require('../config/prod.env')
        }),
    ],
    optimization: {
        runtimeChunk: 'single'
    },
}


// TODO: Deploy dist to server by using webpack-dev-middleware