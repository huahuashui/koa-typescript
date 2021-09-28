import axios, {AxiosError, AxiosResponse} from "axios";
import KeepAliveAgent from './KeepAliveAgent';
import {Config} from '../Config';
import ErrorCode from '../enum/ErrorCode';
import {CustomResponse} from "./CustomResponse";

// 请求工具方法
export class HttpUtil {
    public static get(linkUrl: string, params: object, timeout?: number): Promise<any> {
        console.log('get====', `${Config.GATEWAY_SERVER_URL}${linkUrl}`, params);
        return new Promise((resolve, reject) => {
            axios({
                method: 'get',
                timeout: timeout,
                httpAgent: KeepAliveAgent.getHttpAgent(),
                httpsAgent: KeepAliveAgent.getHttpsAgent(),
                url: `${Config.GATEWAY_SERVER_URL}${linkUrl}`,
                params: params
            }).then((response) => {
                HttpUtil.handlePromise(resolve, reject, response, null);
            }).catch((error) => {
                HttpUtil.handlePromise(resolve, reject, null, error);
            })
        })
    }

    public static post(linkUrl: string, params: object, timeout?: number): Promise<any> {
        console.log('post====', `${Config.GATEWAY_SERVER_URL}${linkUrl}`, params);
        return new Promise((resolve, reject) => {
            axios({
                method: 'post',
                timeout: timeout,
                httpAgent: KeepAliveAgent.getHttpAgent(),
                httpsAgent: KeepAliveAgent.getHttpsAgent(),
                url: `${Config.GATEWAY_SERVER_URL}${linkUrl}`,
                data: params
            }).then((response) => {
                HttpUtil.handlePromise(resolve, reject, response, null);
            }).catch((error) => {
                HttpUtil.handlePromise(resolve, reject, null, error);
            })
        })
    }

    // 数据统一处理
    private static handlePromise(resolve: Function, reject: Function, response: AxiosResponse, error: AxiosError) {
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

