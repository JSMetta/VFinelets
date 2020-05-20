'use strict'
const {
    CleanWebpackPlugin
} = require('clean-webpack-plugin')

module.exports = {
    plugins: [
        new CleanWebpackPlugin({
            cleanOnceBeforeBuildPatterns: ['./*.js', 'static/*']
        }),
    ],
    optimization: {
        runtimeChunk: 'single'
    },
}


// TODO: Deploy dist to server by using webpack-dev-middleware.