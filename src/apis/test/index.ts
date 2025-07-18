import request from "@/utils/axios";
const Test_Test = "/";
const Test_Api = {
  /** 获取待启动流程列表 */
  getTestListData() {
    return request.get<ListDataTotalCount<any>>(`${Test_Test}pagination-example`, {
      params: {}
    });
  },
}
export default Test_Api;