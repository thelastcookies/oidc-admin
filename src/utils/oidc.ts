/**
 * OIDC 认证工具模块
 *
 * 封装 oidc-client-ts 的 UserManager，提供登录、登出、回调处理等功能。
 * 所有 OIDC 配置从环境变量读取，方便不同环境切换。
 */
import type { User, UserManagerSettings } from 'oidc-client-ts';
import { UserManager, WebStorageStateStore } from 'oidc-client-ts';

/** 从完整 URI 中提取路径部分（如 http://localhost:8205/callback → /callback） */
const extractPath = (uri: string): string => {
  try {
    return new URL(uri).pathname;
  } catch {
    return uri;
  }
};

/** OIDC 配置，从环境变量读取 */
const oidcSettings: UserManagerSettings = {
  authority: import.meta.env.APP_OIDC_ISSUER,
  client_id: import.meta.env.APP_OIDC_CLIENT_ID,
  redirect_uri: import.meta.env.APP_OIDC_REDIRECT_URI,
  post_logout_redirect_uri: import.meta.env.APP_OIDC_POST_LOGOUT_REDIRECT_URI,
  scope: import.meta.env.APP_OIDC_SCOPE,
  response_type: 'code',
  automaticSilentRenew: true,
  /**
   * OIDC Core 要求 offline_access 必须与 prompt=consent 同时请求，
   * 否则认证服务器会剔除该 scope，导致拿不到 refresh_token。
   * 仅影响顶层登录跳转；静默刷新走 refresh_token grant，不经过授权端点。
   */
  prompt: 'consent',
  /** 静默刷新失败重试上限，防止无限循环刷请求 */
  maxSilentRenewTimeoutRetries: 3,
  userStore: new WebStorageStateStore({ store: window.localStorage }),
};

/** UserManager 单例 */
let userManager: UserManager | null = null;

const getUserManager = (): UserManager => {
  if (!userManager) {
    userManager = new UserManager(oidcSettings);
  }
  return userManager;
};

/** 是否启用了 OIDC（通过是否配置了 Issuer 判断） */
const isOidcEnabled = (): boolean => {
  return !!import.meta.env.APP_OIDC_ISSUER;
};

/** 获取当前 OIDC 用户 */
const getOidcUser = async (): Promise<User | null> => {
  if (!isOidcEnabled()) return null;
  return getUserManager().getUser();
};

/** 发起 OIDC 登录（重定向到认证中心） */
const oidcLogin = async (): Promise<void> => {
  await getUserManager().signinRedirect();
};

/** 发起 OIDC 登出（重定向到认证中心登出端点） */
const oidcLogout = async (): Promise<void> => {
  const user = await getOidcUser();
  if (user) {
    await getUserManager().signoutRedirect({ id_token_hint: user.id_token });
  } else {
    await getUserManager().signoutRedirect();
  }
};

/** 登录回调路径（从完整 URI 提取） */
const callbackPath = extractPath(import.meta.env.APP_OIDC_REDIRECT_URI);

/**
 * 处理 OIDC 回调
 *
 * 必须在 Vue 应用挂载前调用，因为回调 URL 是真实路径而非 hash 路由。
 *
 * 登录回调流程（/callback）：
 *   1. oidc-server 重定向到 /callback?code=xxx&state=xxx
 *   2. signinRedirectCallback() 用授权码向 token 端点换取令牌
 *   3. 将 access_token、id_token、refresh_token 存入 localStorage
 *   4. 重定向到应用主页
 *
 * scope 包含 offline_access，使用 refresh_token 完成令牌刷新。
 *
 * @returns 是否处理了回调（true 表示回调已处理，不需要挂载 Vue 应用）
 */
const handleOidcCallback = async (): Promise<boolean> => {
  if (!isOidcEnabled()) return false;

  const currentPath = window.location.pathname;

  /** 登录回调：用授权码换取令牌 */
  if (currentPath === callbackPath) {
    try {
      const user = await getUserManager().signinRedirectCallback();
      console.info('OIDC token exchanged successfully:', {
        sub: user.profile.sub,
        access_token: user.access_token.slice(0, 8) + '...',
        expires_at: new Date(user.expires_at! * 1000).toLocaleString(),
      });
      window.location.href = import.meta.env.BASE_URL;
    } catch (e) {
      console.error('OIDC callback error:', e);
      // todo 更鲜明的错误提醒
      window.location.href = import.meta.env.APP_OIDC_POST_LOGOUT_REDIRECT_URI || 'https://localhost:8191/login';
    }
    return true;
  }

  return false;
};

export {
  getUserManager,
  isOidcEnabled,
  getOidcUser,
  oidcLogin,
  oidcLogout,
  handleOidcCallback,
};
