export default class HomeService {
    public getData(): Promise<number[]> {
        return Promise.resolve([1, 2])
    }
}
