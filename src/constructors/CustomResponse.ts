// 接口响应的返回体
import { IResponseBody } from '@@/types/common/ResponseBody';

export class CustomResponse<T = any> implements IResponseBody<T> {
    public code: number | string;
    public data: T;
    public message: string;

    constructor (code: number | string, data: T, message?: string) {
        this.code = code;
        this.data = data;
        this.message = message;
    }
}
