import UserService from '../service/userService';
import {Context, Next} from "koa";

export default class UserController {
    public static service = new UserService();

    // 组装用户信息和用户权益接口数据
    public static loginIn(ctx: Context, next: Next) {
        ctx.body = {
            code: 200,
            data: {
                token: '1234'
            },
            message: 'success'
        }
    }

    // 组装用户信息和用户权益接口数据
    public static loginOut(ctx: Context, next: Next) {
        ctx.body = {
            code: 200,
            data: null,
            message: 'success'
        }
    }

    // 组装用户信息和用户权益接口数据
    public static getUserInfo(ctx: Context, next: Next) {
        // 获取token
        const token = ctx.req.headers.Authrization as string;
        // 未登录
        if (!token) {
            ctx.body = {
                code: 401,
                data: null,
                message: 'success'
            }
            return;
        }
        // 已登录
        Promise.all([
            UserController.service.getUser(),
            UserController.service.getVipRights()
        ]).then(resArr => {
            const userRes = resArr[0];
            const rightsRes = resArr[1];
            ctx.body = {
                code: 200,
                data: {
                    ...userRes.data,
                    ...rightsRes.data,
                    token: ctx.req.headers.Authrization
                },
                message: 'success'
            }
        })
    }
}
