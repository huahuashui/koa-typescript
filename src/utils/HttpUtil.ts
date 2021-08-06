import superagent from 'superagent';
import KeepAliveAgent from './KeepAliveAgent';
import {CustomException} from './CustomException';
import {Config} from '../Config';
import ErrorCode from '../enum/ErrorCode';

// 请求工具方法
export class HttpUtil {

    public static get(linkUrl: string, params: object, timeout?: number): Promise<any> {
        return new Promise((resolve, reject) => {
            superagent.get(linkUrl)
                      .send(params) // sends a JSON post body
                      .set('Content-Type', 'application/json')
                      .accept('application/json')
                      .agent(KeepAliveAgent.getAgent())
                      .timeout(timeout > 0 ? timeout : Config.TIME_OUT)
                      .end((err, res) => {
                          // Calling the end function will send the request
                          HttpUtil.handlePromise(resolve, reject, err, res, linkUrl);
                      });
        })
    }

    public static post(linkUrl: string, params: object, timeout?: number): Promise<any> {
        return new Promise((resolve, reject) => {
            superagent.post(linkUrl)
                      .send(params) // sends a JSON post body
                      .set('Content-Type', 'application/json')
                      .accept('application/json')
                      .agent(KeepAliveAgent.getAgent())
                      .timeout(timeout > 0 ? timeout : Config.TIME_OUT)
                      .end((err, res) => {
                          // Calling the end function will send the request
                          HttpUtil.handlePromise(resolve, reject, err, res, linkUrl);
                      });
        })
    }

    // 数据统一处理
    private static handlePromise(resolve: Function, reject: Function, err: superagent.HTTPError, res: superagent.Response, linkUrl: string) {
        // 这里可能引起的异常过多, 而且会因为异常引起nodejs奔溃, 故保险起见, 在此处使用try catch
        console.log('linkUrl====', linkUrl)
        try {
            if (!err && (res && !res.error)) {
                const body = res.body;
                if (body && body.code == ErrorCode.OK) {
                    resolve(body);
                } else {
                    reject(new CustomException((body && body.code) || ErrorCode.ERROR_BACK_SERVER, err));
                }
            } else {
                // 这里分很多中情况, 404 timeout 等,因为前端不关心这些, 所以暂定为未知错误
                reject(new CustomException((res && res.status) || ErrorCode.ERROR_BACK_SERVER, err));
            }
        } catch (e) {
            reject(new CustomException(ErrorCode.ERROR_NODEJS_ERROR, e));
        }
    }
}
