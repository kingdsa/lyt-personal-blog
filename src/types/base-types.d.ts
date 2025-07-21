declare global {
  // 接口响应数据
  interface User {
    id?: string;
    createdAt?: string;
    updatedAt?: string;
    username?: string;
    email?: string;
    nickname?: string;
    avatar?: string;
    role?: 'admin' | 'user';
    isActive?: boolean;
    lastLoginAt?: string;
    password?: string;
  }
}
export {};
