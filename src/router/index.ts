import Router from "koa-router";
import UserRouter from "./userRouter";

// 加载路由配置
export default class RouterMain {

    // 路由初始化
    public init(router: Router) {
        [UserRouter].forEach(RouterClass => {
            new RouterClass(router);
        })
    }
}





