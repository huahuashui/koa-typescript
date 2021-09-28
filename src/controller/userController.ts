import UserService from '../service/userService';
import {Context, Next} from "koa";
import ErrorCode from "../enum/ErrorCode";
import {CustomResponse} from "../utils/CustomResponse";

export default class UserController {
    public static service = new UserService();

    // 组装用户信息和用户权益接口数据
    public static async loginIn(ctx: Context, next: Next) {
        ctx.body = new CustomResponse(ErrorCode.OK, {
                token: '1234'
            });
    }

    // 组装用户信息和用户权益接口数据
    public static async loginOut(ctx: Context, next: Next) {
        ctx.body = new CustomResponse(ErrorCode.OK, null);
    }

    // 组装用户信息和用户权益接口数据
    public static async getUserInfo(ctx: Context, next: Next) {
        // 获取token
        const token = ctx.req.headers.Authrization as string;
        // 未登录
        if (!token) {
            ctx.body = new CustomResponse(ErrorCode.NO_AUTHORIZATION, null);
            return;
        }
        // 已登录
        Promise.all([
            UserController.service.getUser(),
            UserController.service.getVipRights()
        ]).then(resArr => {
            const userRes = resArr[0];
            const rightsRes = resArr[1];
            ctx.body = new CustomResponse(ErrorCode.NO_AUTHORIZATION, {
                ...userRes.data,
                ...rightsRes.data,
                token: ctx.req.headers.Authrization
            })
        })
    }

    // 测试请求java数据
    public static async getJavaData(ctx: Context, next: Next): Promise<any> {
        try {
            const body = await UserController.service.getJavaData();
            ctx.body = body;
        } catch (err) {
            ctx.body = err;
        }
    }
}
