import type { OidcResponseBody } from '@/api/oidc/types';
import type { CreateRoleRequest, RoleInfo, UpdateRoleRequest } from './types';

/** 获取角色列表（含各角色用户数） */
export const getRoles = () => {
  return useGet<OidcResponseBody<RoleInfo[]>>(
    `${OIDC_URL}/admin/roles`,
    undefined,
    { token: true },
  );
};

/** 创建角色（code 唯一，创建后不允许修改） */
export const createRole = (data: CreateRoleRequest) => {
  return usePost<OidcResponseBody<RoleInfo>, CreateRoleRequest>(
    `${OIDC_URL}/admin/roles`,
    data,
    { token: true },
  );
};

/** 更新角色（仅 name / remark，code 不允许修改） */
export const updateRole = (id: number, data: UpdateRoleRequest) => {
  return usePut<OidcResponseBody<RoleInfo>, UpdateRoleRequest>(
    `${OIDC_URL}/admin/roles/${id}`,
    data,
    { token: true },
  );
};

/** 删除角色（内置 admin 角色不允许删除） */
export const deleteRole = (id: number) => {
  return useDelete<OidcResponseBody<{ msg: string }>>(
    `${OIDC_URL}/admin/roles/${id}`,
    undefined,
    { token: true },
  );
};
