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
          getCurrentUser().then((res) => {
            if (res) {
              userInfo.value = {
                id: res.sub,
                username: res.username,
                realName: res.realName || '',
              };
              // 角色编码数组用于权限判断
              permCodes.value = res.roles;
              resolve();
            } else {
              reject(new Error(WITH_UNAUTHORIZED));
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
