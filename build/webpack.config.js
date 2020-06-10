const utils = require('./utils'),
    merge = require("webpack-merge"),
    HtmlWebpackPlugin = require('html-webpack-plugin'),
    {
        VueLoaderPlugin
    } = require('vue-loader'),
    webpack = require('webpack'),
    commonEnv = require('../config/env'),
    devConfig = require('./webpack.config.dev'),
    prodConfig = require('./webpack.config.prod')

const createCommonConfig = mode => {
    const envPath = `../config/${mode}.env`
    const env = {...commonEnv, ...require(envPath)}
    return merge([{
        entry: {
            app: './finelets/app.js'
        },
        output: {
            filename: '[name].js',
            path: utils.resolve('dist'),
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
            new webpack.DefinePlugin({
                'process.env': env
            }),
        ],
    }, ])
}

const toMergeByMode = {
    prod: [prodConfig, {
        mode: 'production'
    }],
    dev: [devConfig, {
        mode: 'development'
    }],
}

module.exports = (mode) => {
    const commonConfig = createCommonConfig(mode)
    return merge(commonConfig, ...toMergeByMode[mode])
}