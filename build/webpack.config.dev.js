'use strict'

const utils = require('./utils'),
    HtmlWebpackPlugin = require('html-webpack-plugin'),
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
        filename: '[name].js',
        path: utils.resolve('dist'),
    },
    devtool: 'source-map',
    devServer: {
        hot: true,
        watchOptions: {
            // Delay the rebuild after the first change
            aggregateTimeout: 1000,
            poll: 1000
        }
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
                    name: utils.assetsPath('media/[name].[ext]')
                }
            },
            {
                test: /\.(woff2?|eot|ttf|otf)(\?.*)?$/,
                loader: 'url-loader',
                options: {
                    limit: 10000,
                    name: utils.assetsPath('fonts/[name].[ext]')
                }
            }
        ]
    },
    plugins: [
        new VueLoaderPlugin(),
        new HtmlWebpackPlugin({
            title: '纺织品自动化疵点检测操作系统',
            template: 'index.html'
        }),
        new CopyWebpackPlugin([{
            from: utils.resolve('finelets/static/img'),
            to: utils.assetsPath('img'),
            toType: 'dir'
        }]),
        // Ignore node_modules so CPU usage with poll watching drops significantly.
        new webpack.WatchIgnorePlugin([
            utils.resolve("node_modules")
        ]),
        new webpack.DefinePlugin({
            'process.env': require('../config/dev.env')
        }),
    ],
    optimization: {
        moduleIds: 'hashed',
        runtimeChunk: 'single',
        splitChunks: {
            cacheGroups: {
                vendor: {
                    test: /[\\/]node_modules[\\/]/,
                    name: 'vendors',
                    chunks: 'all',
                },
            },
        },
    },
}


// TODO: Deploy dist to server by using webpack-dev-middleware