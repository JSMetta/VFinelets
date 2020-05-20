'use strict'

const utils = require('./utils'),
    CopyWebpackPlugin = require('copy-webpack-plugin'),
    webpack = require('webpack')

module.exports = {
    devtool: 'source-map',
    devServer: {
        hot: true,
        watchOptions: {
            // Delay the rebuild after the first change
            aggregateTimeout: 1000,
            poll: 1000
        }
    },
    plugins: [
        new CopyWebpackPlugin([{
            from: utils.resolve('finelets/static/img'),
            to: utils.assetsPath('img'),
            toType: 'dir'
        }]),
        // Ignore node_modules so CPU usage with poll watching drops significantly.
        new webpack.WatchIgnorePlugin([
            utils.resolve("node_modules")
        ]),
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