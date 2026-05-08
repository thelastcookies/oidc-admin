const loginPath = '/login';
const samplePath = '/sample';
const accessWhileList = [loginPath, '/error', '/401', '/403', '/404', '/500'];

/** OIDC 事件监听是否已初始化 */
let oidcEventsInitialized = false;

/**
 * 初始化 OIDC 事件监听
 *
 * 监听 token 刷新事件，自动同步 access_token 到 token store
 */
const initOidcEvents = () => {
  if (oidcEventsInitialized || !isOidcEnabled()) return;
  oidcEventsInitialized = true;

  const userManager = getUserManager();
  userManager.events.addUserLoaded((user) => {
    const { setToken } = useTokenStore();
    setToken(user.access_token);
  });
  userManager.events.addUserUnloaded(() => {
    const { $reset } = useTokenStore();
    $reset();
  });
};

router.beforeEach(async (to) => {
  setRouteEmitter(to);

  /** 初始化 OIDC 事件监听 */
  initOidcEvents();

  /** OIDC 模式下，同步 access_token 到 token store */
  if (isOidcEnabled()) {
    const user = await getOidcUser();
    const { setToken, getToken } = useTokenStore();
    if (user && !user.expired) {
      const currentToken = getToken();
      if (currentToken !== user.access_token) {
        setToken(user.access_token);
      }
    } else {
      // OIDC 模式下无有效用户，发起 OIDC 登录（重定向到认证中心）
      // 回调路径和静默刷新路径不需要触发登录，避免循环
      const oidcCallbackPaths = [
        new URL(import.meta.env.APP_OIDC_REDIRECT_URI).pathname,
        new URL(import.meta.env.APP_OIDC_SILENT_REDIRECT_URI).pathname,
      ];
      if (!oidcCallbackPaths.includes(to.path)) {
        await oidcLogin();
        return false;
      }
    }
  }

  // 获取 token 进行校验
  const { getToken } = useTokenStore();
  const token = getToken();
  const { loginEnable } = useAppStore();
  if (to.path === samplePath && import.meta.env.DEV) {
    // Sample 页面特殊处理
    return;
  } else if (accessWhileList.includes(to.path)) {
    // 如果目标路径在白名单内
    if (to.path === loginPath && (!loginEnable || token)) {
      // 如果是登录页则检查登录配置与登录状态
      return ({
        path: '/',
      });
    }
    // 其他页面不干涉
    return;
  } else if (loginEnable && !token) {
    // 如果需要登录但未登录，则跳转到登录页
    return ({
      path: loginPath,
      query: { redirect: encodeURIComponent(to.fullPath) },
    });
  } else {
    // 检查用户信息
    const userStore = useUserStore();
    if (!Object.keys(userStore.userInfo).length) {
      // 如果用户信息不存在则尝试获取
      message.loading({
        content: '系统加载中，请稍候',
        key: SYS_LOADING_KEY,
        duration: 0,
      });
      try {
        // 获取用户、Action 信息并进行初始化。
        await userStore.getUserInfo();
        // 获取 Actions 并生成路由配置
        const { getActions } = useActionStore();
        generateRouterConf(await getActions());

        message.success({
          content: '加载完成',
          key: SYS_LOADING_KEY,
        });
        return ({
          path: to.path,
          query: to.query,
          replace: true,
        });
      } catch (e) {
        if ((e as Error).message === WITH_UNAUTHORIZED) {
          const { signOut } = useAppStore();
          await signOut();
          message.error({
            content: '会话已过期，请重新登录',
            key: SYS_LOADING_KEY,
            duration: 7,
          });
        } else {
          message.error({
            content: '加载失败',
            key: SYS_LOADING_KEY,
          });
          return ({
            path: '/500',
            query: { redirect: encodeURIComponent(to.fullPath) },
          });
        }
      }
    } else if (to.query.redirect) {
      // 如果有重定向页面
      return ({
        path: decodeURIComponent(to.query.redirect as string),
        replace: true,
      });
    } else {
      // 预留页面级权限检查
      // 由于目前后端框架特性，暂不需要开发
      return;
    }
  }
});
