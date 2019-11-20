var webpack = require("/Users/wen/Downloads/karma-webpack-example/node_modules/webpack");
module.exports = function (config) {
    config.set({

        files: [
            // 'test/chrome/**'
            // "test/chrome/action/test.js",
            "test/chrome/insertOrDeleteRows/test.js",
            // "test/chrome/toolbarTest/test.js"
            // 'test/chrome/chrome__test.js',
            // 'test/chrome/autofill/auto_fill_test2.js'
        ],

        // frameworks to use
        frameworks: ['mocha'],

        preprocessors: {
            // only specify one entry point
            // and require all tests in there
            'test/**/*.js': [  'webpack',  'coverage' ],

        },

        reporters: ['progress', 'coverage'],


        coverageReporter: {

            dir: 'build/coverage/',
            reporters: [
                {type: 'html'},
                {type: 'text'},
                {type: 'text-summary'}
            ]
        },

        webpack: {
            // webpack configuration
            devtool: 'inline-source-map',
            module: {
                loaders: [{
                    test: /\.js$/,
                    loader: 'babel-loader',
                    exclude: /node_modules/,
                    query: {
                        presets: ['es2015'],
                    }
                }],
            },
        },

        webpackMiddleware: {
            // webpack-dev-middleware configuration
            noInfo: true
        },

        plugins: [
            require("/Users/wen/Downloads/karma-webpack-example/node_modules/karma-webpack"),
            require("/Users/wen/Downloads/karma-webpack-example/node_modules/istanbul-instrumenter-loader"),
            require("/Users/wen/Downloads/karma-webpack-example/node_modules/karma-mocha"),
            require("/Users/wen/Downloads/karma-webpack-example/node_modules/karma-coverage"),
            require("/Users/wen/Downloads/karma-webpack-example/node_modules/karma-phantomjs-launcher"),
            require("/Users/wen/Downloads/karma-webpack-example/node_modules/karma-spec-reporter")
        ],

        browsers: ['PhantomJS']
    });
};