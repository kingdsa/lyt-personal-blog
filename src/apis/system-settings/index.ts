import request from "@/utils/axios";
import { JwtPayload, TokenResult, AccessRecordInputDTO, AccessLogItem } from './types';
const System_Settings = "/system/access-logs";
const System_Token = "/system/token";
const System_Settings_Api = {
  /** 获取访问记录 */
  getAccessRecord(params: AccessRecordInputDTO) {
    return request.get<ListDataTotalCount<AccessLogItem>>(`${System_Settings}`, {
      params
    });
  },
  /** 添加访问记录 */
  addAccessRecord() {
    return request.post<string>(`${System_Settings}`);
  },
  /** 获取token */
  getToken(data: JwtPayload) {
    return request.post<TokenResult>(`${System_Token}/generate`, data);
  },
}
export default System_Settings_Api;