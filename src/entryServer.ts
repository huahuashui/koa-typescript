import Koa, {Context, Next} from "koa";
import Router from "koa-router";
import bodyParser from 'koa-bodyparser';
import helmet from 'koa-helmet';
import RouterMain from "./router";
import interceptorMain from "./interceptor";
import Config from "../config";

function linkStart() {
    // 创建一个Koa对象表示web app本身:
    const app = new Koa();
    const router = new Router();

    // 安全处理
    app.use(helmet());
    // 处理请求体
    app.use(bodyParser());
    // 拦截器
    new interceptorMain(app);
    // 加载路由配置
    new RouterMain().init(router);
    // add router middleware:
    app.use(router.routes());
    // 当请求出错时的处理逻辑
    app.use(router.allowedMethods());
    // 应用级错误捕获
    app.on('error', (err: Error, ctx: Context) => {
        console.error('Error starting server', err, ctx);
    });
    // 在端口3000监听:
    app.listen(Config.server.port, function () {
        console.log(`app started at port ${Config.server.port}...`);
    });
}

linkStart();
