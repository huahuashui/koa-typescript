// 接口响应的返回体
export class CustomResponse<T = any> {
    private code: number | string;
    private data: any;
    private message: string = 'success';

    constructor(code: number | string, data: T, message?: string) {
        this.code = code;
        this.data = data;
        this.message = message;
    }
}
