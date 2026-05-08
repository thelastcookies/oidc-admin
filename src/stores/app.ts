import Bowser from 'bowser';
import type { MessageInstance } from 'ant-design-vue/es/message/interface';
import type { ModalStaticFunctions } from 'ant-design-vue/es/modal/confirm';
import type { NotificationInstance } from 'ant-design-vue/es/notification/interface';

export const useAppStore = defineStore('app', () => {
  const windowInnerWidth = ref(0);
  const windowInnerHeight = ref(0);

  const userAgent = Bowser.getParser(window.navigator.userAgent);
  const deviceType = userAgent.getPlatformType();

  const loginEnable = ref(import.meta.env.APP_LOGIN_ENABLE === 'true');

  const message = ref({} as MessageInstance);
  const notification = ref({} as NotificationInstance);
  const modal = ref({} as Omit<ModalStaticFunctions, 'warn'>);
  (() => {
    const staticFunction = App.useApp();
    message.value = staticFunction.message;
    notification.value = staticFunction.notification;
    modal.value = staticFunction.modal;
  })();

  /**
   * signOut 退出登录
   *
   * OIDC 模式下会重定向到认证中心登出端点，
   * 传统模式下跳转到登录页。
   */
  const signOut = () => {
    return new Promise<void>((resolve) => {
      const actionStore = useActionStore();
      actionStore.$reset();
      const userStore = useUserStore();
      userStore.$reset();
      const tokenStore = useTokenStore();
      tokenStore.$reset();
      if (loginEnable.value) {
        if (isOidcEnabled()) {
          oidcLogout().catch(console.error);
        } else {
          router.push('/login');
        }
      } else {
        parent.window.location.assign('');
      }
      resolve();
    });
  };

  return {
    windowInnerWidth,
    windowInnerHeight,
    userAgent,
    deviceType,
    loginEnable,
    signOut,
    message, notification, modal,
  };
});
