import {Context, Next} from 'koa';
import fs from 'fs';
import Vue from 'vue';
import {createRenderer} from 'vue-server-renderer';
import HomeService from '../service/homeService';

const template = fs.readFileSync('./src/index.html', 'utf-8');
const renderer = createRenderer({
    template
})

export default class HomeController {
    public static service = new HomeService();

    public static async renderHome(ctx: Context, next: Next) {
        const response = await HomeController.service.getData();
        ctx.body = {
            code: 200,
            data: response.data,
            message: '请求成功'
        };
    }

    // 测试html处理
    public static async renderHtml(ctx: Context, next: Next) {
        const app = new Vue({
            data: {
                url: ctx.req.url
            },
            template: `
                <div>访问的 URL 是： {{ url }}</div>`,
            beforeCreate() {
                console.log('beforeCreate')
            },
            created() {
                console.log('created')
            },
            beforeMount() {
                console.log('beforeMount')
            },
            mounted() {
                console.log('mounted')
            },
            methods: {
                init() {
                    console.log('初始化')
                }
            }
        });
        const context = {
            title: 'hello',
            meta: `<meta name="keyword" content="vue,ssr">
                   <meta name="description" content="vue srr demo">`
        };

        renderer.renderToString(app, context).then(html => {
            ctx.status = 200;
            ctx.body = html;
        }).catch(err => {
            ctx.status = 500;
            ctx.body = err;
        })
    }
}
