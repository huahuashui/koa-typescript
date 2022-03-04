import axios, { AxiosError, AxiosRequestConfig, AxiosResponse } from 'axios';
import { ResponseResult } from '@@/types/common/ResponseResult';
import Config from '@@/config';
import ErrorCode from '@/enum/ErrorCode';
import KeepAliveAgent from '@/utils/KeepAliveAgent';
import { CustomResponse } from '@/utils/CustomResponse';

// 请求实例化
const axiosInstance = axios.create({
    // 根据不同环境获取后台接口服务器地址
    // @ts-ignore
    baseURL: Config[process.env.BUILD_ENV].serverUrl,
    timeout: Config.common.timeout,
    httpAgent: KeepAliveAgent.getHttpAgent(),
    httpsAgent: KeepAliveAgent.getHttpsAgent()
});

// 添加一个请求拦截器
axiosInstance.interceptors.request.use((config) => {
    // @ts-ignore

    console.log('http请求', config.method, config.url, config.params, config.data);

    // 在请求发出之前进行一些操作
    config.headers[Config.common.userTokenKey] = 'token';
    // 追加请求头
    config.headers['Request-Site'] = 1;
    return config;
}, (error) => {
    console.error('http请求错误', error);
    // Do something with request error
    return Promise.reject(error);
});

// 添加一个响应拦截器
axiosInstance.interceptors.response.use((response) => {
    const status = response.status;
    const config = response.config;
    const data = response.data;
    console.log('http响应', config.headers, config.url, status, data ? data.code : '');
    // 在这里对返回的数据进行处理
    return response;
}, (error) => {
    console.error('http响应错误', error);
    // Do something with response error
    return Promise.reject(error);
});

// 请求工具方法
export default class HttpUtil {
    /**
     * get请求
     * @param url       请求地址
     * @param params    请求参数
     * @param config    请求配置
     */
    public static get<T = any> (url: string, params: object, config?: AxiosRequestConfig): Promise<ResponseResult<T>> {
        return new Promise((resolve, reject) => {
            axiosInstance.get(url, { ...config, params })
                         .then((response: AxiosResponse<ResponseResult<T>>) => {
                             HttpUtil.success(resolve, reject, response);
                         })
                         .catch((error) => {
                             HttpUtil.fail(resolve, reject, error);
                         });
        });
    }

    /**
     * post请求
     * @param url       请求地址
     * @param params    请求参数
     * @param config    请求配置
     */
    public static post<T = any> (url: string, params: object, config?: AxiosRequestConfig): Promise<ResponseResult<T>> {
        return new Promise((resolve, reject) => {
            axiosInstance.post(url, params, config)
                         .then((response: AxiosResponse<ResponseResult<T>>) => {
                             HttpUtil.success<T>(resolve, reject, response);
                         })
                         .catch((error) => {
                             HttpUtil.fail(resolve, reject, error);
                             // HttpUtil.handlePromise(config)
                         });
        });
    }

    // 请求成功
    private static success<T> (resolve: Function, reject: Function, response: AxiosResponse<ResponseResult<T>>) {
        // console.log('请求成功', response);
        try {
            if (response && response.data && response.data.code === ErrorCode.OK) {
                resolve(response.data);
            } else {
                const code = response && response.data ? response.data.code : '';
                // 这里分很多中情况, 404 timeout 等,因为前端不关心这些, 所以暂定为未知错误
                reject(new CustomResponse(code || ErrorCode.ERROR_BACK_SERVER, null));
            }
        } catch (e) {
            reject(new CustomResponse(ErrorCode.ERROR_NODEJS_ERROR, null));
        }
    }

    // 请求失败
    private static fail (resolve: Function, reject: Function, error: any) {
        // console.log('请求失败', error);
        reject(new CustomResponse(ErrorCode.ERROR_BACK_SERVER, null));
    }

    // 数据统一处理
    private static handlePromise<T = any> (axiosConfig: AxiosRequestConfig, response: AxiosResponse<ResponseResult<T>>, error: AxiosError, resolve: Function, reject: Function) {
        console.log('BACK_HTTP', {
            method: axiosConfig.method,
            url: axiosConfig.url,
            params: axiosConfig.params || axiosConfig.data
        });
        // 这里可能引起的异常过多, 而且会因为异常引起nodejs奔溃, 故保险起见, 在此处使用try catch
        try {
            if (!error && response) {
                const body = response.data;
                if (body && body.code === ErrorCode.OK) {
                    resolve(body);
                } else {
                    reject(new CustomResponse((body && body.code) || ErrorCode.ERROR_BACK_SERVER, error));
                }
            } else {
                // 这里分很多中情况, 404 timeout 等,因为前端不关心这些, 所以暂定为未知错误
                reject(new CustomResponse((response && response.status) || ErrorCode.ERROR_BACK_SERVER, error));
            }
        } catch (e) {
            reject(new CustomResponse(ErrorCode.ERROR_NODEJS_ERROR, e));
        }
    }
}

