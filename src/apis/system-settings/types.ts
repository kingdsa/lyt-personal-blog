export interface JwtPayload {
  sub: string; 
  username?: string;
  email?: string;
  roles?: string[];
  [key: string]: unknown;
}
export interface TokenResult {
  accessToken: string;
  expiresIn: string;
}
export interface AccessRecordInputDTO extends PageParams {
  ip?: string;
}
export interface AccessLogItem {
  /** IP地址 */
  ip?: string;
  /** 地区信息 */
  region?: string;
  /** 国家 */
  country?: string;
  /** 省份 */
  province?: string;
  /** 城市 */
  city?: string;
  /** 用户代理 */
  userAgent?: string;
  /** 设备类型 */
  deviceType?: string;
  /** 操作系统 */
  os?: string;
  /** 浏览器 */
  browser?: string;
}