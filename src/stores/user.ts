import type { UserRecord } from '@/api/admin/user/types';

export const useUserStore = defineStore('user', () => {
  const userInfo = shallowRef({} as UserRecord);
  const permCodes = shallowRef([] as string[]);

  const getUserInfo = async () => {
    return new Promise<void | Error>((resolve, reject) => {
      /** OIDC 模式：从 ID Token 中提取用户信息 */
      // if (import.meta.env.APP_OIDC_ISSUER) {
      //   getOidcUser().then(user => {
      //     console.log(user);
      //     if (user) {
      //       userInfo.value = {
      //         Id: user.profile.sub,
      //         UserName: user.profile.username || user.profile.name || user.profile.sub,
      //         RealName: user.profile.name || user.profile.username || user.profile.sub,
      //       };
      //       resolve();
      //     } else {
      //       reject(new Error(WITH_UNAUTHORIZED));
      //     }
      //   }).catch(e => reject(e));
      //   return;
      // }
      //
      // /** 传统模式：从后端 API 获取用户信息 */
      // getOperatorInfo().then(res => {
      //   if (!res.Success) {
      //     reject(new Error(WITH_UNAUTHORIZED));
      //   } else {
      //     userInfo.value = res.Data!.UserInfo;
      //     permCodes.value = res.Data!.Permissions;
      //     resolve();
      //   }
      // }).catch(e => reject(e));
    });
  };

  const hasPerm = (code: string | string[]) => {
    const codes = (isArray(code) ? code : [code]) as string[];
    return codes.some(c => permCodes.value.includes(c));
  };

  const $reset = () => {
    userInfo.value = {};
    permCodes.value = [];
  };

  return {
    userInfo,
    hasPerm,
    getUserInfo,
    $reset,
  };
});
