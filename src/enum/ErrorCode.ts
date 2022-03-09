// 错误码定义
export default {
    // HTTP响应 ===================
    // 正常
    OK: 200,
    // 没有权限
    NO_AUTHORIZATION: 401,
    // 当前接口未找到
    NO_FOUND: 404.5,
    // 服务报错
    ERROR: 500,

    // 后台Java服务响应码 ===================

    // 正常
    JAVA_OK: '0',
    // 服务报错
    JAVA_ERROR: 'G-500',
    // 服务挂掉或重启中
    JAVA_SERVER_STOP: '400000',

    // Node服务响应码 ======================

    // 解析Java接口返回数据异常
    NODE_JAVA_ERROR: 20000,
    // Node服务异常
    NODE_ERROR: 20000.5,
    // 未知错误
    NODE_UNKNOWN_ERROR: 20001,
    // 传入的参数不能为空
    NODE_NO_PARAM: 20002
};
