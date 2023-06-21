/* eslint-disable prettier/prettier */
/* eslint-disable import/no-extraneous-dependencies */
/* eslint-disable @typescript-eslint/no-var-requires */
const path = require('path');
const { merge } = require('webpack-merge');
const common = require('./webpack.common.js');

const config = {
    mode: 'development',
    devtool: 'source-map',
    ignoreWarnings: [/./],
    devServer: {
        host: process.env.IP,
        https: false,
        allowedHosts: 'all',
        static: {
            directory: path.resolve(__dirname, 'public'),
        },
        historyApiFallback: true,
        client: {
            overlay: true,
        },
        hot: true,
        port: 8066,
        compress: true,
        open: true,
    },
};

module.exports = merge(common, config);
