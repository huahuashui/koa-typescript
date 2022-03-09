import { Context, Next } from 'koa';
import log4js, { Configuration } from 'log4js';
import Config from '@@/config/index';
// @ts-ignore
const EnvConfig = Config[process.env.BUILD_ENV];
// 日志级别
const levels = {
    'trace': 'TRACE',
    'debug': 'DEBUG',
    'info': 'INFO',
    'warn': 'WARN',
    'error': 'ERROR'
};
const log4jsLogger = log4js.configure({
    appenders: {
        out: {
            type: 'stdout',
            layout: {
                type: 'colored'
            }
        },
        // 所有日志记录
        access: {
            type: 'dateFile',
            filename: `${ EnvConfig.logPath }/access`,
            pattern: 'yyyy-MM-dd.log',
            numBackups: 7,
            alwaysIncludePattern: true
        },
        // 错误日志过滤器使用
        emergencies: {
            type: 'dateFile',
            filename: `${ EnvConfig.logPath }/error`,
            pattern: 'yyyy-MM-dd.log',
            numBackups: 7,
            alwaysIncludePattern: true
        },
        // 错误日志
        justErrors: {
            type: 'logLevelFilter',
            appender: 'emergencies',
            level: levels.error
        }
    },
    categories: {
        default: {
            appenders: [ 'out', 'justErrors', 'access' ], level: levels.info
        }
    },
    replaceConsole: false,
    disableClustering: true
    // pm2: true,
    // pm2InstanceVar: 'BANGONGZU_PC_INSTANCE_ID'
} as Configuration);
// 日志记录方法
type logHandle = (msg: ILogMessage | string) => void;

// 日志记录
export interface ILogMessage {
    // ip地址
    ip?: string;
    // 请求方式
    method?: string;
    // 请求地址
    url?: string;
    // 请求参数
    params?: any;
    // 响应时间
    duration?: number;
    // 状态码
    code?: string | number;
    // 信息文案
    message?: string;
    // 堆栈信息
    stack?: any;
}

// 日志实例
interface ILogger {
    // 正常日志打印
    info: logHandle,
    // 警告日志打印
    warn: logHandle,
    // 错误日志打印
    error: logHandle
}

/**
 * 打印数据处理
 */
function formatMsg (msg: ILogMessage | string) {
    return msg ? typeof msg === 'object' ? JSON.stringify(msg) : msg : '_';
}

export default {
    // 日志模块标识-返回日志实例
    getLogger (name: string) {
        const Logger = log4jsLogger.getLogger(name);
        return {
            /**
             * 正常日志打印
             */
            info (msg: ILogMessage | string) {
                Logger.info(formatMsg(msg));
            },
            /**
             * 警告日志打印
             */
            warn (msg: ILogMessage | string) {
                Logger.warn(formatMsg(msg));
            },
            /**
             * 错误日志打印
             */
            error (msg: ILogMessage | string) {
                Logger.error(formatMsg(msg));
            }
        } as ILogger;
    },
    // 请求拦截处理-记录响应时间
    connectLogger (logger: ILogger) {
        return async function (ctx: Context, next: Next) {
            logger.info(`${ ctx.req.url } **************************************请求开始**************************************`);
            const startTime = new Date().getTime();
            // 监听响应结束
            ctx.res.on('finish', () => {
                const endTime = new Date().getTime();
                logger.info({
                    ip: ctx.request.ip,
                    method: ctx.request.method,
                    url: ctx.req.url,
                    params: ctx.request.body,
                    duration: endTime - startTime,
                    code: ctx.res.statusCode,
                    message: ctx.res.statusMessage
                });
                logger.info(`${ ctx.req.url } **************************************请求结束**************************************`);
            });
            await next();
        };
    }
};
