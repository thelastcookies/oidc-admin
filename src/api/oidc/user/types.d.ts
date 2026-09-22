/** 角色摘要（用户信息内嵌） */
export interface RoleBrief {
  id: number;
  code: string;
  name: string;
}

/** 用户信息（脱敏后不含密码） */
export interface UserInfo {
  id: number;
  username: string;
  enabled: boolean;
  roles: RoleBrief[];
  createdAt: string;
  updatedAt: string;
}

/** 用户分页列表 */
export interface UserListResult {
  list: UserInfo[];
  total: number;
  page: number;
  pageSize: number;
}

/** 用户分页查询参数（keyword 按用户名模糊匹配） */
export interface UserListQuery {
  page?: number;
  pageSize?: number;
  keyword?: string;
}

/** 创建用户请求体 */
export interface CreateUserRequest {
  username: string;
  password: string;
  // 初始角色，缺省不分配
  roleIds?: number[];
  // 默认启用
  enabled?: boolean;
}

/** 更新用户请求体（username 不允许修改；传入 roleIds 则整体替换角色绑定） */
export interface UpdateUserRequest {
  enabled?: boolean;
  roleIds?: number[];
}

/** 管理员重置密码请求体（免旧密码） */
export interface ResetPasswordRequest {
  password: string;
}
