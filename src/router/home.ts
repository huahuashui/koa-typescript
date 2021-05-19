import Router from "koa-router";

// controller
import HomeController from '../controller/homeController';

export default class Home {
    private static URL = '/';

    constructor(router: Router) {
        this.activate(router);
    }

    private activate(router: Router) {
        router.get(Home.URL, async (ctx, next) => {
            HomeController.renderHome(ctx, next)
        });

        router.get(Home.URL + 'a', async (ctx, next) => {
            HomeController.renderHome(ctx, next)
        });

        router.get(Home.URL + 'b', async (ctx, next) => {
            HomeController.renderHome(ctx, next)
        });
    }
}
