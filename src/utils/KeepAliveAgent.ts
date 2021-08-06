/**
 * Created by xupengtao on 2017/4/21.
 */
import Agent from "agentkeepalive";

export default class KeepAliveAgent {
    /** 获取keepalive agent */
    public static getAgent() {
        return KeepAliveAgent.keepaliveAgent;
    }

    /** keep alive agent */
    private static keepaliveAgent = new Agent({
        keepAlive: true,
        maxSockets: 100,
        maxFreeSockets: 10,
        timeout: 90000,
        freeSocketTimeout: 60000, // free socket keepalive for 30 seconds
    });
}
