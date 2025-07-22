import request from "@/utils/axios";
const User_Auth = "/user/auth";
const User_Api = {
  /** 用户注册 */
  register(data: User) {
    return request.post<string>(`${User_Auth}/register`, data);
  },
  /** 用户登录 */
  login(data: User) {
    return request.post<{
      token: string;
      user: User;
    }>(`${User_Auth}/login`, data);
  },
}
export default User_Api;