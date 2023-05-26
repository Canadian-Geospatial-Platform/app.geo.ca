/* eslint-disable prettier/prettier */
/* eslint-disable import/no-extraneous-dependencies */
/* eslint-disable @typescript-eslint/no-var-requires */
const webpack = require("webpack");
const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const CopyWebpackPlugin = require("copy-webpack-plugin");
// const DotEnv = require('dotenv-webpack');

// const childProcess = require('child_process');
const package = require("./package.json");

// get version numbers and the hash of the current commit
const [major, minor, patch] = package.version.split(".");
// const hash = JSON.stringify(childProcess.execSync('git rev-parse HEAD').toString().trim());
console.log(`Build app.geo.ca: ${major}.${minor}.${patch}`);

const config = {
  entry: path.resolve(__dirname, "src/app.tsx"),
  output: {
    path: path.resolve(__dirname, "dist"),
    publicPath: "/",
    filename: "app.geo.ca.js",
  },
  resolve: {
    extensions: [".mjs", ".ts", ".tsx", ".js", ".jsx", ".json", ".jpg"],
    fallback: {
      fs: false,
      tls: false,
      net: false,
      path: false,
      zlib: false,
      http: false,
      https: false,
      stream: false,
      crypto: false,
      "crypto-browserify": false,
    },
  },
  performance: {
    maxEntrypointSize: 2048000,
    maxAssetSize: 4096000,
  },
  module: {
    rules: [
      {
        test: /.(ts|tsx|js|jsx)$/,
        exclude: [path.resolve(__dirname, "node_modules")],
        loader: "babel-loader",
      },
      {
        test: /\.s?[ac]ss$/,
        use: ["style-loader", "css-loader", "sass-loader"],
      },
      {
        test: /\.(png|jpg|gif)$/,
        use: [
          {
            loader: "file-loader",
          },
        ],
      },
      {
        test: /\.svg$/,
        use: ["@svgr/webpack"],
      },
    ],
  },
  plugins: [
    new CopyWebpackPlugin({
      patterns: [
        {
          from: path.resolve(__dirname, "public/assets"),
          to: path.resolve(__dirname, "dist/assets"),
          force: true,
        },
        {
          from: path.resolve(__dirname, "public/root"),
          to: path.resolve(__dirname, "dist/"),
          force: true,
        },
      ],
    }),
    new HtmlWebpackPlugin({
      template: "./public/index.html",
      title: "APP.GEO.CA Viewer",
    }),
    new webpack.DefinePlugin({
      __VERSION__: {
        major,
        minor,
        patch,
        timestamp: Date.now(),
      },
    }),
  ],
};

module.exports = config;
