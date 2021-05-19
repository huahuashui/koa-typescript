const path = require('path');
const webpack = require('webpack');
const VueSSRServerPlugin = require('vue-server-renderer/server-plugin');
const ProgressBarPlugin = require('progress-bar-webpack-plugin');
const TerserPlugin = require('terser-webpack-plugin');
const HappyPack = require('happypack');
const ForkTsCheckerWebpackPlugin = require('fork-ts-checker-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const nodeExternals = require('webpack-node-externals');

const config = require('../config/build.config');
const tsConfig = require.resolve('../tsconfig.json');

module.exports = {
    mode: 'production',
    entry: {
        entryServer: './src/entryServer.ts',
    },
    // 这允许 webpack 以 Node 适用方式(Node-appropriate fashion)处理动态导入(dynamic import)，
    // 并且还会在编译 Vue 组件时，
    // 告知 `vue-loader` 输送面向服务器代码(server-oriented code)。
    target: 'node',
    // 此处告知 server bundle 使用 Node 风格导出模块(Node-style exports)
    output: {
        path: path.resolve(process.cwd(), './dist'),
        publicPath: '/',
        filename: '[name].js',
        chunkFilename: '[name].[chunkhash:7].js',
        libraryTarget: 'commonjs2'
    },
    resolve: {
        extensions: ['.js', '.json', '.ts', 'tsx'],
        alias: {
            // ...config.alias,
        }
    },
    // 外置化应用程序依赖模块。可以使服务器构建速度更快，
    // 并生成较小的 bundle 文件
    externals: nodeExternals(),
    optimization: {
        minimize: true,
        minimizer: [
            // new TerserPlugin({
            //     terserOptions: {
            //         output: {
            //             comments: false
            //         }
            //     }
            // })
        ],
        splitChunks: {
            chunks: "all", // 在做代码分割时，只对异步代码生效，写成all的话，同步异步代码都会分割
            minSize: 30000, // 引入的包大于80KB才做代码分割
            maxSize: 0, // 限制包的大小
            minChunks: 1, // 当一个包至少被用了多少次的时候才进行代码分割
            maxAsyncRequests: 5, // 同时加载的模块数最多是5个
            maxInitialRequests: 1, // 入口文件做代码分割最多能分成3个js文件
            automaticNameDelimiter: '~', // 文件生成时的连接符
            name: true, // 让cacheGroups里设置的名字有效
            cacheGroups: { // 当打包同步代码时,上面的参数生效
                vendors: {
                    test: /[\\/]node_modules[\\/]/, // 检测引入的库是否在node_modlues目录下的
                    priority: -10, // 值越大,优先级越高.模块先打包到优先级高的组里
                    filename: 'common/vendors.js' // 把所有的库都打包到一个叫vendors.js的文件里
                },
                default: {
                    priority: -20,
                    reuseExistingChunk: true, // 如果一个模块已经被打包过了,那么再打包时就忽略这个上模块
                    filename: 'common/common.js'
                }
            }
        }
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
        // 所有静态资源存放到static目录--如图片等
        new CopyWebpackPlugin([
            {from: path.join(__dirname, '../static'), to: "static"}
        ]),
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
        new ProgressBarPlugin()
    ],
    // 对 bundle renderer 提供 source map 支持
    devtool: 'source-map'
};
