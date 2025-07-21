declare global {
  // 接口响应数据
  interface User {
    id?: string;
    createdAt?: Date;
    updatedAt?: Date;
    username?: string;
    email?: string;
    nickname?: string;
    avatar?: string;
    role?: 'admin' | 'user';
    isActive?: boolean;
    lastLoginAt?: Date;
    password?: string;
  }
}
export {};
