module.exports = {
    // 公共配置
    common: {
        // ip
        host: '0.0.0.0',
        // 端口
        port: 3000,
        // 用户token-键值
        userTokenKey: "Authrization",
        // 超时时间
        timeout: 10000,
    },
    // 本地环境
    local: {
        // 日志存放目录
        logPath: '/logs',
        // 后台服务地址
        serverUrl: "https://test-office.iask.com/gateway",
    },
    // 开发环境
    dev: {
        // 日志存放目录
        logPath: '/data/logs/koa-typescript/',
        // 后台服务地址
        serverUrl: "https://test-office.iask.com/gateway",
    },
    // 测试环境
    test: {
        // 日志存放目录
        logPath: '/data/logs/koa-typescript/',
        // 后台服务地址
        serverUrl: "https://test-office.iask.com/gateway",
    },
}
