const path = require('path');
const merge = require('webpack-merge');
const common = require('./webpack.config.js');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CleanWebpackPlugin = require('clean-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');

module.exports = merge(common, {
    mode: 'production',
    devtool: 'source-map',
    plugins: [
        new CleanWebpackPlugin(['dist']),
        //  you should know that the HtmlWebpackPlugin by default will generate its own index.html
        new HtmlWebpackPlugin({
            template: './index.html',
            title: 'fin-cell',
        }),
        new MiniCssExtractPlugin({
            // Options similar to the same options in webpackOptions.output
            // both options are optional
            filename: '[name].css',
            // chunkFilename: devMode ? '[id].[hash].css' : '[id].css',
        }),
    ],
    optimization: {
        splitChunks: {
            chunks: "all",
            cacheGroups: {
                vendors: {
                    test: /[\\/]node_modules[\\/]/,  // 匹配node_modules目录下的文件
                    priority: -10   // 优先级配置项
                },
                default: {
                    minChunks: 2,
                    priority: -20,   // 优先级配置项
                    reuseExistingChunk: true
                }
            },
        },
    },
    entry: {
      f: "./src/core/operator.js"
    },
    output: {
        filename: '[name].js',
        path: path.resolve(__dirname, '../dist'),
    },
});
