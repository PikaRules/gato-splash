const path = require('path');
const webpack = require('webpack');
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const webpackMerge = require('webpack-merge');
const commonConfig = require('./base.js');
const TerserPlugin = require('terser-webpack-plugin');
const utils = require('./utils.js');

const extractSass = new MiniCssExtractPlugin({
    filename: "css/[name].[contenthash].css"
});

module.exports = function() {

    let config = {};
    config.module = { rules: [] };
    config.mode = 'production';

    config.target = 'electron-renderer';

    config.entry = {
        app: './src/main.ts'
    };

    config.node = {
        // tell webpack that we actually want a working __dirname value
        // (ref: https://webpack.js.org/configuration/node/#node-__dirname)
        __dirname: false
      };

    const showSourceMap = false;

    config.optimization = {
        minimize: true,
        minimizer: [new TerserPlugin({
            parallel: true,
            sourceMap: showSourceMap,
            terserOptions: {
                beautify: false,
                sourceMap: showSourceMap,
                i8: true,
                mangle: true,
                compress: {
                    // screw_ie8: true,
                    keep_fnames: true,
                    // dead_code: false, // not remove unreachable code
                    // unused: false, // not remove unused variables
                    properties: false,
                    global_defs: {
                        ngDevMode: false,
                        ngI18nClosureMode: false,
                        ngJitMode: false
                    }
                },
                output: {
                    beautify: false,
                    comments: false
                }
            }
        })]
    }

    ///----

    // ==================================================================================
    /**
     * Devtool
     * Reference: http://webpack.github.io/docs/configuration.html#devtool
     * Type of sourcemap to use per build type
     * test: inline-source-map
     * dev: eval-source-map
     * prod: source-map
     */
    // config.devtool = 'source-map'; // 'source-map'; cheap-module-inline-source-map


    // ==================================================================================
    /**
     * Loaders
     * https://webpack.js.org/loaders/
     */

    // sass loader
    config.module.rules.push({
        test: /\.scss$/,
        use: [ MiniCssExtractPlugin.loader,
            "css-loader",
            "sass-loader",
        ],
        include: [path.resolve(__dirname, '../src/assets/css')],
        exclude: /node_modules/
    });

    // ====
    // babel invironment
    process.env.ENV = 'prod';

    /*
    config.resolve = {
        alias: {
            pixi: path.resolve(__dirname, '../vendors/pixi-v5.3.7/pixi.min.js' )
        },
        extensions: [".tsx", ".ts", ".js", ".css", ".scss"],
        modules: [path.resolve(__dirname, '../src/'), path.resolve(__dirname, '../node_modules')]
    };*/


    // ==================================================================================

    /**
     * Plugins definition
     */

    // minification is droping unused files (but some of these files are really been used, but they are marked as alias)
    // disable minification until a solution for this issue can be found.

    config.plugins = [
        extractSass,
        // remove moment locales, except en.
        // (moment locales has to be loaded using import after loading moment in order to make it load when its minified)
        new webpack.ContextReplacementPlugin(/moment[\/\\]locale$/, /en.js/),
        new webpack.LoaderOptionsPlugin({
            minimize: true,
            debug: false
        })
    ];



    if ( process.env.APP_ENV === 'development') {

        // ==================================================================================
        /**
         * Dev server configuration
         * Reference: http://webpack.github.io/docs/configuration.html#devserver
         * Reference: http://webpack.github.io/docs/webpack-dev-server.html
         */
        config.devServer = {
            hot: true,
            contentBase: './dist',
            stats: 'minimal',
            host: 'localhost',
            port: '8079',
            disableHostCheck: true,
            historyApiFallback: true
        };

        config.output = commonConfig().output;
        config.output.publicPath = "http://localhost:8079/";
    }

    // -- complete ---

    let common = commonConfig();
    utils.removeTsLoaders(common);

    return webpackMerge(common, config);;
};
