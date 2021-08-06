import {Context, Next} from "koa";
import Router from "koa-router";
import UserController from '../controller/userController';

export default class UserRouter {
    private static URL = '/user';

    constructor(router: Router) {
        // 登录
        router.post(`${UserRouter.URL}/loginIn`, async (ctx: Context, next: Next) => {
            UserController.loginIn(ctx, next);
        });

        // 登出
        router.post(`${UserRouter.URL}/loginOut`, async (ctx: Context, next: Next) => {
            UserController.loginOut(ctx, next);
        });

        // 获取用户信息
        router.get(`${UserRouter.URL}/getUserInfo`, async (ctx: Context, next: Next) => {
            UserController.getUserInfo(ctx, next);
        });
    }
}
