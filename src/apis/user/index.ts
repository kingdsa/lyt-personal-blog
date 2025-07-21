import request from "@/utils/axios";
const User = "/user";
const User_Api = {
  /** 用户注册 */
  register(data: User) {
    return request.post<ListDataTotalCount<any>>(`${User}/register`, data);
  },
}
export default User_Api;