const path = require('path');
const webpack = require('webpack');
const ProgressBarPlugin = require('progress-bar-webpack-plugin');
const TerserPlugin = require('terser-webpack-plugin');
const HappyPack = require('happypack');
const ForkTsCheckerWebpackPlugin = require('fork-ts-checker-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const nodeExternals = require('webpack-node-externals');
const config = require('../config');
const tsConfig = require.resolve('../tsconfig.json');

module.exports = {
    mode: 'production',
    entry: {
        entryServer: './src/entryServer.ts',
    },
    output: {
        path: path.resolve(process.cwd(), './dist/server/'),
        publicPath: '/',
        filename: path.posix.join('js', '[name].[hash:7].js'),
        chunkFilename: path.posix.join('js', '[name].[chunkhash:7].js'),
    },
    resolve: {
        extensions: ['.js', '.json', '.ts', 'tsx'],
        alias: {
            // ...config.alias,
        },
    },
    externals: nodeExternals(),
    optimization: {
        minimize: false,
        minimizer: [
            // new TerserPlugin({
            //     terserOptions: {
            //         output: {
            //             comments: false
            //         }
            //     }
            // })
        ]
    },
    performance: {
        hints: false
    },
    stats: {
        children: false
    },
    module: {
        rules: [
            {
                test: /\.js$/,
                exclude: /node_modules/,
                use: ['babel-loader']
            },
            {
                test: /\.ts$/,
                exclude: /node_modules/,
                enforce: 'pre',
                use: ['happypack/loader?id=ts-lint-pack']
            },
            {
                test: /\.ts$/,
                exclude: /node_modules/,
                use: ['happypack/loader?id=ts-pack']
            }
        ]
    },
    plugins: [
        /****   使用HappyPack实例化    *****/
        new HappyPack({
            id: 'ts-lint-pack',
            threads: 2,
            use: [
                {
                    loader: 'tslint-loader',
                    options: {
                        // tslint错误默认显示为警告
                        emitErrors: true
                    }
                }
            ]
        }),
        new HappyPack({
            id: 'ts-pack',
            threads: 2,
            use: [
                'babel-loader',
                {
                    loader: 'ts-loader',
                    options: {
                        happyPackMode: true,
                        transpileOnly: true,
                        configFile: tsConfig,
                    }
                }
            ]
        }),
        /**** end *****/
        new ForkTsCheckerWebpackPlugin({
            vue: true,
            tslint: true,
            checkSyntacticErrors: true,
            tsconfig: tsConfig
        }),
        new webpack.HashedModuleIdsPlugin(),
        new webpack.optimize.ModuleConcatenationPlugin(),
        new ProgressBarPlugin(),
    ],
    devtool: 'cheap-module-inline-source-map'
};
