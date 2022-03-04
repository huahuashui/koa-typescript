// import axios, { AxiosError, AxiosRequestConfig, AxiosResponse } from 'axios';
//
// import KeepAliveAgent from './KeepAliveAgent';
// import config from '../../config';
// import ErrorCode from '../enum/ErrorCode';
// import { CustomResponse } from './CustomResponse';
//
// import { ResponseResult } from '../../types/common/ResponseResult';
//
// // 添加拦截器
// const axiosInstance = axios.create({
//     timeout: config.common.timeout,
//     httpAgent: KeepAliveAgent.getHttpAgent(),
//     httpsAgent: KeepAliveAgent.getHttpsAgent()
// });
//
// // 请求工具方法
// export class HttpUtil {
//     // 根据不同环境获取后台接口服务器地址
//     // @ts-ignore
//     public static serverUrl: string = config[process.env.BUILD_ENV].serverUrl;
//
//     public static get<T = any> (linkUrl: string, params: object, timeout?: number): Promise<T> {
//         return new Promise((resolve, reject) => {
//             const axiosConfig = {
//                 method: 'GET',
//                 timeout: timeout,
//                 httpAgent: KeepAliveAgent.getHttpAgent(),
//                 httpsAgent: KeepAliveAgent.getHttpsAgent(),
//                 url: `${ HttpUtil.serverUrl }${ linkUrl }`,
//                 params: params
//             } as AxiosRequestConfig;
//             axios(axiosConfig).then((response: AxiosResponse<ResponseResult<T>>) => {
//                 HttpUtil.handlePromise<T>(axiosConfig, response, null, resolve, reject);
//             }).catch((error) => {
//                 HttpUtil.handlePromise<T>(axiosConfig, null, error, resolve, reject);
//             });
//         });
//     }
//
//     public static post<T = any> (linkUrl: string, params: object, timeout?: number): Promise<T> {
//         return new Promise((resolve, reject) => {
//             const axiosConfig = {
//                 method: 'post',
//                 timeout: timeout,
//                 httpAgent: KeepAliveAgent.getHttpAgent(),
//                 httpsAgent: KeepAliveAgent.getHttpsAgent(),
//                 url: `${ HttpUtil.serverUrl }${ linkUrl }`,
//                 data: params
//             } as AxiosRequestConfig;
//             axios(axiosConfig).then((response: AxiosResponse<ResponseResult<T>>) => {
//                 HttpUtil.handlePromise<T>(axiosConfig, response, null, resolve, reject);
//             }).catch((error) => {
//                 HttpUtil.handlePromise<T>(axiosConfig, null, error, resolve, reject);
//             });
//         });
//     }
//
//     // 数据统一处理
//     private static handlePromise<T = any> (axiosConfig: AxiosRequestConfig, response: AxiosResponse<ResponseResult<T>>, error: AxiosError, resolve: Function, reject: Function) {
//         console.log('BACK_HTTP', {
//             method: axiosConfig.method,
//             url: axiosConfig.url,
//             params: axiosConfig.params || axiosConfig.data
//         });
//         // 这里可能引起的异常过多, 而且会因为异常引起nodejs奔溃, 故保险起见, 在此处使用try catch
//         try {
//             if (!error && response) {
//                 const body = response.data;
//                 if (body && body.code === ErrorCode.OK) {
//                     resolve(body);
//                 } else {
//                     reject(new CustomResponse((body && body.code) || ErrorCode.ERROR_BACK_SERVER, error));
//                 }
//             } else {
//                 // 这里分很多中情况, 404 timeout 等,因为前端不关心这些, 所以暂定为未知错误
//                 reject(new CustomResponse((response && response.status) || ErrorCode.ERROR_BACK_SERVER, error));
//             }
//         } catch (e) {
//             reject(new CustomResponse(ErrorCode.ERROR_NODEJS_ERROR, e));
//         }
//     }
// }
//
