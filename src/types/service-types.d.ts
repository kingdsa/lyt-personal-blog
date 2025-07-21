declare global {
  // 接口响应数据
  interface ServerResult<T = unknown> {
    code: number;
    msg: string;
    data: T;
  }
  interface ListDataTotalCount<T = unknown> {
    list: T[];
    total: number;
  }

  interface PageParams {
    page: number;
    limit: number;
  }
}
export {};
