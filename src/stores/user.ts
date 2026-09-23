interface CurrentUserRecord {
  id?: number;
  username?: string;
  realName?: string | null;
}

export const useUserStore = defineStore('user', () => {
  const userInfo = shallowRef({} as CurrentUserRecord);
  const permCodes = shallowRef([] as string[]);

  const getUserInfo = async () => {
    return new Promise<void | Error>((resolve, reject) => {
      if (import.meta.env.APP_OIDC_ISSUER) {
        getOidcUser().then(user => {
          if (!user) {
            reject(new Error(WITH_UNAUTHORIZED));
            return;
          }
          getCurrentUser().then(({ success, data, msg }) => {
            if (success && data) {
              userInfo.value = {
                id: data.id,
                username: data.username,
                realName: data.realName || '',
              };
              // 角色编码数组用于权限判断
              permCodes.value = data.roles;
              resolve();
            } else {
              reject(new Error(msg || WITH_UNAUTHORIZED));
            }
          }).catch(e => reject(e));
        }).catch(e => reject(e));
        return;
      }
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
