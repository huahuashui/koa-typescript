/**
 * Created by xupengtao on 2017/4/21.
 */
import Agent from "agentkeepalive";

export default class KeepAliveAgent {
    /** 获取keepalive agent */
    public static getHttpAgent() {
        return KeepAliveAgent.httpAgent;
    }

    public static getHttpsAgent() {
        return KeepAliveAgent.httpsAgent;
    }

    /** keep alive agent */
    private static httpAgent = new Agent({
        keepAlive: true,
        maxSockets: 100,
        maxFreeSockets: 10,
        timeout: 90000,
        // free socket keepalive for 30 seconds
        freeSocketTimeout: 60000
    });

    /** keep alive agent */
    private static httpsAgent = new Agent.HttpsAgent({
        keepAlive: true,
        maxSockets: 100,
        maxFreeSockets: 10,
        timeout: 90000,
        // free socket keepalive for 30 seconds
        freeSocketTimeout: 60000
    });
}
