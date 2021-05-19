import path from 'path';
import fs from 'fs';

// 当前node工程的根路径
const PROJECT_PATH = path.join(__dirname, '..' + path.sep + '..' + path.sep);

export default {
    // 分隔符
    FILE_SEPER: path.sep,
    /**
     * 缓存当前node工程的根路径
     * 注意: 当此文件位置变化时, 需要修改下面的固定配置, 以定位到项目根路径
     */
    PROJECT_PATH: PROJECT_PATH,
    /**
     * @param relativeDirPath 相对于整个项目工程 src 下的相对路径
     * @return 绝对路径(只返回文件夹路径)
     */
    getDirPath(relativeDirPath: string): string {
        return path.join(PROJECT_PATH, relativeDirPath);
    },
    /**
     * 获取目标文件夹下的所有子文件路径
     * 此方法是同步方法
     * 此方法会过滤目标文件夹下的子文件夹, 只读取目标文件下的子文件
     * @param absoluteDirPath
     * @returns Array<string> 返回数组
     * @exception 返回空数组
     */
    getFilesPathSync(absoluteDirPath: string): string[] {
        const result: string[] = [];
        try {
            // 判断路径是否存在 若路径不存在, 则直接在此抛出异常
            fs.accessSync(absoluteDirPath);
            // 同步读取文件路径
            const filePaths = fs.readdirSync(absoluteDirPath) || [];
            filePaths.forEach((path) => {
                // 判断文件是否是文件，而非文件夹
                const stats = fs.lstatSync(absoluteDirPath + path);
                if (stats.isFile()) {
                    result.push(absoluteDirPath + path);
                }
            });
        } catch (err) {
            console.error("PathHelper.getFilesPath Error", err && err.message, err && err.stack);
        }

        return result;
    },
    /**
     * 获取目标文件夹下的所有子文件路径
     * 此方法是异步方法
     * 此方法会过滤目标文件夹下的子文件夹, 只读取目标文件下的子文件
     * @param absoluteDirPath
     * @returns Array<string> | null 返回字符串数组或者空值
     */
    getFilesPath(absoluteDirPath: string): Promise<string[]> {
        return Promise.resolve(null).then(() => {
            // 判断路径是否存在 若路径不存在, 则直接在此抛出异常
            fs.accessSync(absoluteDirPath);
            return null;
        }).then(() => {
            // 同步读取文件路径
            const filePaths = fs.readdirSync(absoluteDirPath) || [];
            const result: string[] = [];
            filePaths.forEach((path) => {
                // 判断文件是否是文件，而非文件夹
                const stats = fs.lstatSync(absoluteDirPath + path);
                if (stats.isFile()) {
                    result.push(absoluteDirPath + path);
                }
            });
            return result;
        }).catch((err) => {
            console.error("PathHelper.getFilesPath Error", err && err.message, err && err.stack);
            return Promise.resolve([]);
        });
    }
}
