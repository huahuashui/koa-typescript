import { Context, Next } from 'koa';
import ErrorCode from '@/enum/ErrorCode';
import { CustomResponse } from '@/constructors/CustomResponse';
import UserService from '@/services/userService';

export default class UserController {
    public static service = new UserService();

    // 组装用户信息和用户权益接口数据
    public static async loginIn (ctx: Context, next: Next) {
        return new CustomResponse(ErrorCode.OK, {
            token: '1234'
        });
    }

    // 组装用户信息和用户权益接口数据
    public static async loginOut (ctx: Context, next: Next) {
        return new CustomResponse(ErrorCode.OK, null);
    }

    // 组装用户信息和用户权益接口数据
    public static async getUserInfo (ctx: Context, next: Next) {
        let body = null;
        // 获取token
        const token = ctx.req.headers.Authrization as string;
        // 未登录
        if (!token) {
            body = new CustomResponse(ErrorCode.NO_AUTHORIZATION, null);
        } else {
            // 已登录
            const userRes = await UserController.service.getUser();
            const rightsRes = await UserController.service.getVipRights();
            body = new CustomResponse(ErrorCode.NO_AUTHORIZATION, {
                ...userRes.data,
                ...rightsRes.data,
                token: ctx.req.headers.Authrization
            });
        }
        return body;
    }

    // 测试请求java数据
    public static async getJavaData (ctx: Context, next: Next): Promise<any> {
        return await UserController.service.getJavaData();
    }

    // 测试请求java数据
    public static async getJavaData1 (ctx: Context, next: Next): Promise<any> {
        return await UserController.service.getJavaData1();
    }
}
