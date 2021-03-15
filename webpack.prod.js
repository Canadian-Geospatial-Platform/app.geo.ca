/* eslint-disable import/no-extraneous-dependencies */
/* eslint-disable @typescript-eslint/no-var-requires */
const path = require('path');
const { merge } = require('webpack-merge');
const common = require('./webpack.common.js');

const config = {
  output: {
    path: path.join(__dirname, '/dist'),
    filename: process.env.production ? 'static/bundle.min.[contenthash].js' : 'static/bundle.min.[hash].js',
    publicPath: '/'
  }
};

module.exports = merge(common, config);
