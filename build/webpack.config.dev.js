'use strict'

const path = require('path'),
    HtmlWebpackPlugin = require('html-webpack-plugin'),
    {
        CleanWebpackPlugin
    } = require('clean-webpack-plugin'),
    {
        VueLoaderPlugin
    } = require('vue-loader')

module.exports = {
    mode: 'development',
    entry: {
        app: './src/app.js'
    },
    output: {
        filename: '[name].bundle.js',
        path: path.resolve(__dirname, 'dist'),
    },
    devtool: 'inline-source-map',
    devServer: {
        hot: true,
        watchOptions: {
            poll: true
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
    ]
}


// TODO: Deploy dist to server by using webpack-dev-middleware