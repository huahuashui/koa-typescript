// 错误码定义
export default {
    // 正常
    OK: 0,
    // 没有权限
    NO_AUTHORIZATION: 401,
    // 当前接口未找到
    ERROR_INTERFACE_NO_FOUND: 404.5,

    // 后台java服务报错
    ERROR_BACK_SERVER: 500,

    // nodejs后台错误
    ERROR_NODEJS_ERROR: 20000.5,
    // 未知错误
    ERROR: 20001,
    // 传入的参数不能为空
    ERROR_NO_PARAM: 20002,
    // 传入的userId不能为空
    ERROR_NO_USER_ID_PARAM: 20003,
};
