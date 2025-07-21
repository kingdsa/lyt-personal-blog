import request from "@/utils/axios";
import { JwtPayload, TokenResult, AccessRecordInputDTO, AccessLogItem } from './types';
const System_Settings = "/system";
const System_Settings_Api = {
  /** 获取访问记录 */
  getAccessRecord(params: AccessRecordInputDTO) {
    return request.get<ListDataTotalCount<AccessLogItem>>(`${System_Settings}/access-logs`, {
      params
    });
  },
  /** 添加访问记录 */
  addAccessRecord() {
    return request.post<string>(`${System_Settings}/access-logs`);
  },
  /** 获取token */
  getToken(data: JwtPayload) {
    return request.post<TokenResult>(`${System_Settings}/generate-token`, data);
  },
}
export default System_Settings_Api;