import type { OidcResponseBody } from '@/api/oidc/types';
import type { ChangePasswordRequest, OidcUserInfo } from './types';

/** 获取当前用户信息（id、username、roles），身份来自自身 Access Token */
export const getCurrentUser = () => {
  return useGet<OidcUserInfo>(
    `${OIDC_URL}/me`,
    undefined,
    { token: true },
  );
};

/**
 * 自助修改密码
 *
 * 成功后保留当前会话，撤销其他会话，其他端下一次访问 SSO 时需要重新登录
 */
export const changePassword = (data: ChangePasswordRequest) => {
  return usePut<OidcResponseBody<{ msg: string }>, ChangePasswordRequest>(
    `${OIDC_URL}/password`,
    data,
    { token: true },
  );
};
