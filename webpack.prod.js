/* eslint-disable prettier/prettier */
/* eslint-disable import/no-extraneous-dependencies */
/* eslint-disable @typescript-eslint/no-var-requires */
const TerserPlugin = require('terser-webpack-plugin');
// const path = require('path');
const { merge } = require('webpack-merge');
const common = require('./webpack.common.js');

const config = {
    mode: 'production',
    optimization: {
        minimizer: [new TerserPlugin({})],
    }
};

module.exports = merge(common, config);
