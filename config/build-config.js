const path = require('path');
const fs = require('fs');
const nodeExternals = require('webpack-node-externals');

// 同步查询当前目录下所有文件
function readdirSync(str) {
    let fileList = fs.readdirSync(str);
    let ret = [];
    fileList.forEach(function (file) {
        const str2 = path.resolve(str, file);
        const stat = fs.lstatSync(str2);
        if (stat.isDirectory()) {
            const temp = readdirSync(str2);
            ret = ret.concat(temp);
        } else {
            // 去除后缀
            ret.push({
                path: str2,
                file: file
            });
        }
    });
    return ret;
}

// 同步查询当前目录下所有文件
function removeFileSuffix(file) {
    return file.split('.')[0];
}

// 分离的公共部分-打包入口配置
const externals = {
};

// 排除-不进行编译打包的文件
exports.externals = [externals, nodeExternals()];

// 目录映射
exports.alias = {
    // 根目录
    '@@': path.resolve(__dirname, '../'),
    // src目录
    '@': path.resolve(__dirname, '../src')
};
