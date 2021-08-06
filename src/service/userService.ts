export default class UserService {

    // 获取用户信息
    public getUser(): Promise<any> {
        return Promise.resolve({
            code: 200,
            data: {
                id: '1111',
                name: 'zs'
            }
        })
    }

    // 获取用户权益
    public getVipRights(): Promise<any> {
        return Promise.resolve({
            code: 200,
            data: {
                downloadNum: 20
            }
        })
    }
}
