import type { OidcResponseBody } from '@/api/oidc/types';
import type {
  CreateUserRequest,
  ResetPasswordRequest,
  UpdateUserRequest,
  UserListQuery,
  UserListResult,
  UserInfo,
} from './types';

/** 获取用户分页列表 */
export const getUsers = (params?: UserListQuery) => {
  return useGet<OidcResponseBody<UserListResult>, UserListQuery>(
    `${OIDC_URL}/admin/users`,
    params,
    { token: true },
  );
};

/** 获取用户详情 */
export const getUser = (id: number) => {
  return useGet<OidcResponseBody<UserInfo>>(
    `${OIDC_URL}/admin/users/${id}`,
    undefined,
    { token: true },
  );
};

/** 创建用户（可同时分配初始角色） */
export const createUser = (data: CreateUserRequest) => {
  return usePost<OidcResponseBody<UserInfo>, CreateUserRequest>(
    `${OIDC_URL}/admin/users`,
    data,
    { token: true },
  );
};

/** 更新用户（启停、角色整体替换；username 不允许修改） */
export const updateUser = (id: number, data: UpdateUserRequest) => {
  return usePut<OidcResponseBody<UserInfo>, UpdateUserRequest>(
    `${OIDC_URL}/admin/users/${id}`,
    data,
    { token: true },
  );
};

/** 管理员重置密码（免旧密码，重置后撤销该用户全部会话） */
export const resetUserPassword = (id: number, data: ResetPasswordRequest) => {
  return usePut<OidcResponseBody<{ msg: string }>, ResetPasswordRequest>(
    `${OIDC_URL}/admin/users/${id}/password`,
    data,
    { token: true },
  );
};

/** 删除用户 */
export const deleteUser = (id: number) => {
  return useDelete<OidcResponseBody<{ msg: string }>>(
    `${OIDC_URL}/admin/users/${id}`,
    undefined,
    { token: true },
  );
};
