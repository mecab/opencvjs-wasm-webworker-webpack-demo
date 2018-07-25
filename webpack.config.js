const path = require('path');
const CopyWebpackPlugin = require("copy-webpack-plugin");
const ExtractTextPlugin = require("mini-css-extract-plugin");
const autoprefixer = require('autoprefixer');
const webpack = require('webpack');
const bourbon = require('bourbon');

module.exports = {
    mode: process.env.NODE_ENV === 'production' ? 'production' : 'development',
    entry: {
        index: './assets/js/index.js'
    },
    output: {
        path: __dirname + "/builtAssets",
        publicPath: "/assets/",
        filename: 'js/[name].js'
    },
    module: {
        rules: [
            {
                test: /(!opencv)\.js?$/,
                exclude: /(node_modules|bower_components)/,
                loader: 'babel-loader',
                query: {
                    presets: ['env'],
                    plugins: ['transform-runtime']
                }
            },
            {
                test: /\.worker\.js$/,
                use: {
                    loader: 'worker-loader',
                    options: {
                        name: 'js/[name].js'
                    }
                }
            },
            {
                test: /\.s?css$/,
                use: [
                    ExtractTextPlugin.loader,
                    'css-loader',
                    'postcss-loader',
                    {
                        loader: 'sass-loader',
                        options: {
                            includePaths: [
                                path.resolve(
                                    __dirname,
                                    'node_modules/purecss-sass/vendor/assets/stylesheets'
                                ),
                                bourbon.includePaths
                            ]
                        }
                    }
                ]
            },
            {
                test: /\.(jpg|gif|png|svg)$/,
                loader: "file-loader?name=img/[name].[ext]"
            },
            { test: /\.woff(2)?(\?v=[0-9]\.[0-9]\.[0-9])?$/, loader: "url-loader?name=fonts/[name].[ext]&limit=10000&minetype=application/font-woff" },
            { test: /\.(ttf|eot)(\?v=[0-9]\.[0-9]\.[0-9])?$/, loader: "file-loader?name=fonts/[name].[ext]" }
        ]
    },
    plugins: [
        new CopyWebpackPlugin([{ from: 'assets/img', to: 'img' }]),
        new CopyWebpackPlugin([{ from: 'assets/wasm', to: 'wasm' }]),
        new ExtractTextPlugin({
            filename: 'css/[name].css',
            chunkFilename: 'css/[id].css'
        }),
        new webpack.LoaderOptionsPlugin({
            options: {
                postcss: function() {
                    return [ autoprefixer ];
                }
            }
        }),
    ],
    node: { fs: 'empty' }
};
