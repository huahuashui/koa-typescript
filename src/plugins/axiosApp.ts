import axios, { AxiosError, AxiosRequestConfig, AxiosResponse } from 'axios';
import { IResponseBody } from '@@/types/common/ResponseBody';
import Config from '@@/config/index';
import { CustomResponse } from '@/constructors/CustomResponse';
import ErrorCode from '@/enum/ErrorCode';
import AgentKeepaliveApp from '@/plugins/AgentkeepaliveApp';
// axios实例化
const axiosInstance = axios.create({
    timeout: Config.common.timeout,
    httpAgent: AgentKeepaliveApp.getHttpAgent(),
    httpsAgent: AgentKeepaliveApp.getHttpsAgent(),
    // 状态码为200或者状态码为401都进入成功回调
    validateStatus: status => {
        return status === ErrorCode.OK || status === ErrorCode.NO_AUTHORIZATION;
    }
});
// 添加一个请求拦截器
axiosInstance.interceptors.request.use((axiosConfig) => {
    console.log('HTTP正常请求', axiosConfig.baseURL, axiosConfig.url);
    // 在请求发出之前进行一些操作-追加请求头
    // axiosConfig.headers = '123';
    return Promise.resolve(axiosConfig);
}, (error) => {
    console.error('HTTP错误请求');
    // 这里极少情况会进来，暂时没有找到主动触发的方法
    return Promise.reject(new CustomResponse(
        ErrorCode.NODE_JAVA_ERROR,
        null,
        `Request-fail，${ error ? error.message : '未知异常' }`
    ));
});
// 添加一个响应拦截器
axiosInstance.interceptors.response.use((response) => {
    console.log('HTTP正常响应');
    // 通过 validateStatus 配置进到来的 http status
    let bodyResult: IResponseBody = null;
    try {
        const resBody = response && response.data;
        if (!resBody) {
            bodyResult = new CustomResponse(
                ErrorCode.NODE_JAVA_ERROR,
                null,
                `Response-success，body数据为空`
            );
        } else if (typeof resBody === 'object') {
            bodyResult = resBody;
        } else if (typeof resBody === 'string') {
            try {
                // 数据反序列化
                bodyResult = JSON.parse(resBody);
            } catch (e) {
                bodyResult = new CustomResponse(
                    ErrorCode.NODE_JAVA_ERROR,
                    null,
                    `Response-success，body数据反序列化失败`
                );
            }
        } else {
            bodyResult = new CustomResponse(
                ErrorCode.NODE_JAVA_ERROR,
                null,
                `Response-success，不支持的body数据类型：${ typeof resBody }`
            );
        }
    } catch (err) {
        // 数据处理异常
        bodyResult = new CustomResponse(
            ErrorCode.NODE_ERROR,
            null,
            `Response-success，Node错误捕获，${ err.message }`
        );
    }
    return Promise.resolve(bodyResult);
}, (error) => {
    console.error('HTTP错误响应');
    // http 状态码不符合validateStatus都会进来这里
    // 取消请求也会进入这里，可以用 axios.isCancel(error) 来判断是否是取消请求
    // 请求运行有异常也会进入这里，如故意将 headers 写错：axios.defaults.headers = '123'
    // 断网
    let bodyResult: IResponseBody = null;
    if (error.response) {
        // 请求已发出，服务器返回的 http 状态码未通过validateStatus方法校验
        bodyResult = new CustomResponse(
            ErrorCode.NODE_JAVA_ERROR,
            null,
            `Response-fail，请求已发出，不正确的响应，${ error.message }`
        );
    } else if (error.request) {
        // 请求已发出，但没有收到响应，例如：断网
        bodyResult = new CustomResponse(
            ErrorCode.NODE_JAVA_ERROR,
            null,
            `Response-fail，请求已发出，未收到响应，${ error.message }`
        );
    } else {
        // 请求被取消或者发送请求时异常
        if (axios.isCancel(error)) {
            bodyResult = new CustomResponse(
                ErrorCode.NODE_ERROR,
                null,
                `Response-fail，请求被取消，${ error.message }`
            );
        } else {
            bodyResult = new CustomResponse(
                ErrorCode.NODE_ERROR,
                null,
                `Response-fail，发送请求时异常，${ error.message }`
            );
        }
    }
    return Promise.reject(bodyResult);
});
export {
    AxiosRequestConfig,
    AxiosResponse,
    AxiosError,
    axiosInstance
};
