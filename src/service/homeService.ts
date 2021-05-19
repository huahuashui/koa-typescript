import {Config} from "../config";
import {RequestUtil} from "../utils/RequestUtil";

export default class HomeService {
    // 测试数据请求
    public async getData(): Promise<any> {
        const linkUrl = `${Config.FDS_SERVER_URL}/market/nodeManage/getChildNodeBySiteAndTemrinal`;
        const params = {
            terminal: 0,
            // 站点：办公-0 教育-1 建筑-2 全站-3 主站-4 合同站-5 ppt站-6 合同通-7
            site: 7,
            // 层级深度
            level: 2
        }
        return await RequestUtil.post(linkUrl, params);
    }
}
