import Koa, { Context } from 'koa';
import Router from 'koa-router';
import bodyParser from 'koa-bodyparser';
import helmet from 'koa-helmet';
import koaStatic from 'koa-static';
import favicon from 'koa-favicon';
import config from '@@/config';
import RouterMain from '@/router';
import interceptorMain from '@/interceptor';
import log4jsApp from '@/plugins/log4jsApp';

function linkStart () {
    // 创建一个Koa对象
    const app = new Koa();
    const router = new Router();
    const appLogger = log4jsApp.getLogger('APP');
    // 静态资源暴露
    app.use(koaStatic('./static', {
        // 默认为true  访问的文件为index.html  可以修改为别的文件名或者false
        index: false,
        // 是否同意传输隐藏文件
        hidden: false,
        // 如果为true，则在返回next()之后进行服务，从而允许后续中间件先进行响应
        defer: true
    }));
    // 设置图标
    app.use(favicon('/favicon.ico'));
    // 安全处理
    // app.use(helmet());
    // 设置只能https请求
    // app.use(helmet.contentSecurityPolicy());
    app.use(helmet.dnsPrefetchControl());
    app.use(helmet.expectCt());
    app.use(helmet.frameguard());
    app.use(helmet.hidePoweredBy());
    app.use(helmet.hsts());
    app.use(helmet.ieNoOpen());
    app.use(helmet.noSniff());
    app.use(helmet.permittedCrossDomainPolicies());
    app.use(helmet.referrerPolicy());
    app.use(helmet.xssFilter());
    // 处理请求体
    app.use(bodyParser());
    // 拦截器
    new interceptorMain(app);
    // 加载路由配置
    new RouterMain(app, router);
    // 应用级错误捕获
    app.on('error', (err: Error, ctx: Context) => {
        appLogger.error({
            message: `Node运行报错: ${ err && err.message }`,
            stack: err && err.stack
        });
    });
    // 端口监听
    app.listen(config.common.port, config.common.host, () => {
        appLogger.info({
            message: `Node启动成功${__dirname}==${ process.env.BUILD_ENV }: ${ config.common.host }:${ config.common.port }`
        });
    });
}

// 启动服务
linkStart();

