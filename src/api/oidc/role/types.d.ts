/** 角色信息（含用户数统计） */
export interface RoleInfo {
  id: number;
  // 角色编码：下发到 claims 的值，创建后不允许修改
  code: string;
  name: string;
  remark: string | null;
  userCount: number;
  createdAt: string;
  updatedAt: string;
}

/** 创建角色请求体 */
export interface CreateRoleRequest {
  // 角色编码：下发到 claims 的值，创建后不允许修改
  code: string;
  // 展示名称：如 "管理员"
  name: string;
  remark?: string;
}

/** 更新角色请求体（code 不允许修改） */
export interface UpdateRoleRequest {
  name?: string;
  remark?: string;
}
