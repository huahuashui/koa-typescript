import { axiosInstance, AxiosRequestConfig } from '@/plugins/axiosApp';
import { IResponseBody } from '@@/types/common/ResponseBody';
import Config from '@@/config/index';
import ErrorCode from '@/enum/ErrorCode';
import log4jsApp, { ILogMessage } from '@/plugins/log4jsApp';
// 日志
const Logger = log4jsApp.getLogger('BACK-HTTP');
// 请求工具方法
export default class NodeHttp {
    // 根据不同环境获取后台接口服务器地址
    // @ts-ignore
    public static baseURL = Config[process.env.BUILD_ENV].serverUrl;

    /**
     * get请求
     * @param url       请求地址
     * @param params    请求参数
     * @param axiosConfig    请求配置
     */
    public static get<T = any> (url: string, params: object, axiosConfig?: AxiosRequestConfig): Promise<IResponseBody<T>> {
        const startTime = new Date().getTime();
        return new Promise((resolve, reject) => {
            const linkUrl = `${ NodeHttp.baseURL }${ url }`;
            axiosInstance.get<any, IResponseBody<T>>(linkUrl, { ...axiosConfig, params })
                         .then((body) => {
                             const endTime = new Date().getTime();
                             // 记录日志
                             NodeHttp.loggerByCode({
                                 method: 'GET',
                                 url: linkUrl,
                                 params,
                                 duration: endTime - startTime,
                                 code: body.code,
                                 message: body.message
                             });
                             // 数据返回
                             resolve(body);
                         })
                         .catch((body) => {
                             const endTime = new Date().getTime();
                             // 记录日志
                             NodeHttp.loggerByCode({
                                 method: 'GET',
                                 url: linkUrl,
                                 params,
                                 duration: endTime - startTime,
                                 code: body.code,
                                 message: body.message
                             });
                             // 数据返回
                             resolve(body);
                         });
        });
    }

    /**
     * post请求
     * @param url       请求地址
     * @param params    请求参数
     * @param axiosConfig    请求配置
     */
    public static post<T = any> (url: string, params: object, axiosConfig?: AxiosRequestConfig): Promise<IResponseBody<T>> {
        const startTime = new Date().getTime();
        return new Promise((resolve, reject) => {
            const linkUrl = `${ NodeHttp.baseURL }${ url }`;
            axiosInstance.post<any, IResponseBody<T>>(url, params, axiosConfig)
                         .then((body) => {
                             const endTime = new Date().getTime();
                             // 记录日志
                             NodeHttp.loggerByCode({
                                 method: 'POST',
                                 url: linkUrl,
                                 params,
                                 duration: endTime - startTime,
                                 code: body.code,
                                 message: body.message
                             });
                             // 数据返回
                             resolve(body);
                         })
                         .catch((body) => {
                             const endTime = new Date().getTime();
                             // 记录日志
                             NodeHttp.loggerByCode({
                                 method: 'POST',
                                 url: linkUrl,
                                 params,
                                 duration: endTime - startTime,
                                 code: body.code,
                                 message: body.message
                             });
                             // 数据返回
                             resolve(body);
                         });
        });
    }

    // 日志打印
    private static loggerByCode (logMessage: ILogMessage) {
        const code = logMessage.code;
        // 日志记录
        if (code === ErrorCode.OK || code === ErrorCode.JAVA_OK) {
            // 成功响应
            Logger.info(logMessage);
        } else if (
            code === ErrorCode.ERROR || code === ErrorCode.NODE_ERROR || code === ErrorCode.NODE_JAVA_ERROR ||
            code === ErrorCode.JAVA_ERROR || code === ErrorCode.JAVA_SERVER_STOP
        ) {
            // 错误响应
            Logger.error(logMessage);
        } else {
            // 其他响应
            Logger.warn(logMessage);
        }
    }
}

