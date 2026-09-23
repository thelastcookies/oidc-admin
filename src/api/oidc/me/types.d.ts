/** 当前用户信息（roles 为角色编码数组，与 claims 中的 roles 一致） */
export interface CurrentUserInfo {
  id: number;
  username: string;
  realName: string | null;
  roles: string[];
}

/** 自助修改密码请求体 */
export interface ChangePasswordRequest {
  oldPassword: string;
  newPassword: string;
}
