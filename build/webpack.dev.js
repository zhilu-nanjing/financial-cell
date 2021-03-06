const merge = require('webpack-merge');
const common = require('./webpack.config.js');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CleanWebpackPlugin = require('clean-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');

module.exports = merge(common, {
    mode: 'development',
    plugins: [
        new CleanWebpackPlugin(['dist']),
        //  you should know that the HtmlWebpackPlugin by default will generate its own index.html
        new HtmlWebpackPlugin({
            template: './index.html',
            title: 'fin-cell',
        }),
        new HtmlWebpackPlugin({
            template: './index.html',
            title: 'fin-cell',
        }),
        new MiniCssExtractPlugin({
            // Options similar to the same options in webpackOptions.output
            // both options are optional
            filename: '[name].[contenthash].css',
            // chunkFilename: devMode ? '[id].[hash].css' : '[id].css',
        }),
    ],
    output: {
        filename: '[name].[contenthash].js',
        globalObject: 'this',
    },
    devtool: 'inline-source-map',
    devServer: {
        // host: '192.168.31.33',
        host: "127.0.0.1",
        contentBase: '../dist',
    },
});
