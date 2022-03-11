const path = require('path');
const webpack = require('webpack');
const ProgressBarPlugin = require('progress-bar-webpack-plugin');
const TerserPlugin = require('terser-webpack-plugin');
const HappyPack = require('happypack');
const ForkTsCheckerWebpackPlugin = require('fork-ts-checker-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');

// 监听文件变化-重新编译后-重新启动Node服务
const NodemonPlugin = require('nodemon-webpack-plugin');

const buildConfig = require('../config/build-config');
const tsConfig = require.resolve('../tsconfig.json');

module.exports = {
    mode: 'production',
    target: 'node',
    // 监听文件变化，触发编译
    watch: true,
    watchOptions: {
        aggregateTimeout: 1000,
        poll: 1000,
        // 忽略目录
        ignored: ['**/node_modules', '**/dist', '**/build', '**/logs'],
        stdin: true
    },
    entry: {
        server: './src/server.ts',
    },
    output: {
        path: path.resolve(process.cwd(), './dist/'),
        publicPath: '/',
        filename: '[name].js',
        chunkFilename: '[name].js',
    },
    resolve: {
        extensions: ['.js', '.json', '.ts', 'tsx'],
        alias: buildConfig.alias,
    },
    externals: buildConfig.externals,
    optimization: {
        minimize: false
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
        // 定义变量
        new webpack.DefinePlugin({
            // 运行编译命令时传入，用于node服务启动时获取不同配置
            'process.env.BUILD_ENV': JSON.stringify(process.env.BUILD_ENV)
        }),
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
        new NodemonPlugin({
            script: './dist/server.js',
            watch: path.resolve('./dist')
        })
    ],
    devtool: 'eval-source-map'
};
