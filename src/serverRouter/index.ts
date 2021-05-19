import Router from "koa-router";
import home from "./home";

// 加载路由配置
export default class RouterMain {
    public init(router: Router) {
        [home].forEach(item => {
            new item(router);
        })
    }
}





