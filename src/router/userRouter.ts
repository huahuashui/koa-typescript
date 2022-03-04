import {Context, Next} from "koa";
import Router from "koa-router";
import UserController from '@/controller/userController';

export default class UserRouter {
    private static URL = '/user';

    constructor(router: Router) {
        // 登录
        router.post(`${UserRouter.URL}/loginIn`, async (ctx: Context, next: Next) => {
            try {
                ctx.body = await UserController.loginIn(ctx, next);
            } catch (err) {
                ctx.body = err;
            }
        });

        // 登出
        router.post(`${UserRouter.URL}/loginOut`, async (ctx: Context, next: Next) => {
            try {
                ctx.body = await UserController.loginOut(ctx, next);
            } catch (err) {
                ctx.body = err;
            }
        });

        // 获取用户信息
        router.get(`${UserRouter.URL}/getUserInfo`, async (ctx: Context, next: Next) => {
            try {
                ctx.body = await UserController.getUserInfo(ctx, next);
            } catch (err) {
                ctx.body = err;
            }
        });

        // 获取用户信息
        router.get(`${UserRouter.URL}/test`, async (ctx: Context, next: Next) => {
            try {
                ctx.body = await UserController.getJavaData(ctx, next);
            } catch (err) {
                ctx.body = err;
            }
        });

        // 获取用户信息
        router.get(`${UserRouter.URL}/test1`, async (ctx: Context, next: Next) => {
            try {
                ctx.body = await UserController.getJavaData1(ctx, next);
            } catch (err) {
                ctx.body = err;
            }
        });
    }
}
