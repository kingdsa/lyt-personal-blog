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