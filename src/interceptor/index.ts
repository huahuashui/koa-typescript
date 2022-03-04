import Koa, {Context, Next} from "koa";

export default class InterceptorMain {

    // 忽略不拦截的请求
    private static IGNORE_URL_List: string[] = [];

    /**
     * 是否忽略
     * @param url
     * @return {boolean}
     */
    private static isIgnore(url: string) {
        let result = false;
        if (!url) return result;
        const ignoreUrlList = InterceptorMain.IGNORE_URL_List;
        for (let i = 0, len = ignoreUrlList.length; i < len; i++) {
            if (url.indexOf(ignoreUrlList[i]) >= 0) {
                // 当前url为需要忽略的url, 则设置为true
                result = true;
                break;
            }
        }
        return result;
    }

    constructor(app: Koa) {
        this.activate(app);
    }

    private activate(app: Koa): void {
        app.use(async (ctx: Context, next: Next) => {
            console.log(`Node-HTTP 请求start ${ctx.request.method} ${ctx.request.url}...`);
            await next();
        });
    }
}
