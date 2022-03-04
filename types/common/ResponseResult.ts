/**
 * 返回model
 */

export interface ResponseResult<T = any> {
  code: string;
  message: string;
  data: T;
}

export interface PageResult1<T = any> {
  //  当前页码
  currentPage: number;
  // 每页多少数据
  pageSize: number;
  // 数据集合
  rows: T[];
  // 总页数
  totalPages: number;
  // 总条数
  totalSize: number;
}

export interface PageResult2<T = any> {
  // 数据集合
  list: T;
  //  当前页码
  pageNumber: number;
  // 每页多少数据
  pageSize: number;
  // 总条数
  total: number;
  // 总页数
  totalPages: number;
}