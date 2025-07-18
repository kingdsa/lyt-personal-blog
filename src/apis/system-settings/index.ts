import request from "@/utils/axios";
const System_Settings = "/system";
const System_Settings_Api = {
  /** 获取访问记录 */
  getAccessRecord(params: PageParams) {
    return request.get<ListDataTotalCount<any>>(`${System_Settings}/access-logs`, {
      params
    });
  },
  /** 添加访问记录 */
  addAccessRecord() {
    return request.post<ListDataTotalCount<any>>(`${System_Settings}/access-logs`);
  },
}
export default System_Settings_Api;