import HomeService from '../service/homeService';
import {Context, Next} from "koa";

export default class HomeController {
    public static service = new HomeService();

    public static renderHome(ctx: Context, next: Next) {

        HomeController.service.getData().then((response: number[]) => {
            ctx.body = response;
        })
    }
}
