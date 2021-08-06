import {Config} from "../Config";
import {HttpUtil} from "../utils/HttpUtil";

export default class UserService {

    // 获取用户信息
    public async getUser(): Promise<any> {
        return Promise.resolve({
            code: 200,
            data: {
                id: '1111',
                name: 'zs'
            }
        })
    }

    // 获取用户权益
    public async getVipRights(): Promise<any> {
        return Promise.resolve({
            code: 200,
            data: {
                downloadNum: 20
            }
        })
    }

    // 测试数据请求
    public async getJavaData(): Promise<any> {
        const linkUrl = `${Config.FDS_SERVER_URL}/market/nodeManage/getChildNodeBySiteAndTemrinal`;
        const params = {
            terminal: 0,
            // 站点：办公-0 教育-1 建筑-2 全站-3 主站-4 合同站-5 ppt站-6 合同通-7
            site: 7,
            // 层级深度
            level: 2
        }
        return await HttpUtil.post(linkUrl, params);
    }
}
