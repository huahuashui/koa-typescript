import Koa from 'koa';
import Router from 'koa-router';
import UserRouter from '@/router/userRouter';
// 加载路由配置
export default class RouterMain {
    // 路由初始化
    private static activate (app: Koa, router: Router) {
        // 路由初始化
        [ UserRouter ].forEach(RouterClass => {
            new RouterClass(router);
        });
        // add router middleware:
        app.use(router.routes());
        // 当请求出错时的处理逻辑
        app.use(router.allowedMethods());
    }

    constructor (app: Koa, router: Router) {
        RouterMain.activate(app, router);
    }
}





