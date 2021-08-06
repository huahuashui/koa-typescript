export class CustomException {
    constructor(private _code: number, private _errMsg: Error) {}

    get code(): number {
        return this._code;
    }

    get errMsg() {
        return JSON.stringify(this._errMsg);
    }

}
