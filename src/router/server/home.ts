import {Context, Next} from 'koa';
import Router from "koa-router";

// controller
import HomeController from '../../controller/homeController';

export default class Home {

    constructor(router: Router) {
        this.activate(router);
    }

    private activate(router: Router) {
        router.get('/', async (ctx: Context, next: Next) => {
            await HomeController.renderHome(ctx, next).catch(err => {
                ctx.body = err;
            });
        });

        router.get('/a', async (ctx: Context, next: Next) => {
            await HomeController.renderHtml(ctx, next).catch(err => {
                ctx.body = err;
            });
        });

        router.get('/b', async (ctx: Context, next: Next) => {
            await HomeController.renderHome(ctx, next).catch(err => {
                ctx.body = err;
            });
        });
    }
}
