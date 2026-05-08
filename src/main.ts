import { createApp } from 'vue';
import App from './App.vue';
import { handleOidcCallback } from '@/utils/oidc';

// 全局样式表
import '@/assets/style/index.less';

// Pinia
import { createPinia } from 'pinia';

// router
import router from '@/router';
import '@/router/guards.ts';

// UI框架 ant-design-vue
import Antd from 'ant-design-vue';
import 'ant-design-vue/dist/reset.css';

// UnoCSS
import 'virtual:uno.css';

/**
 * 应用初始化
 *
 * OIDC 回调必须在 Vue 应用挂载前处理，
 * 因为回调 URL 是真实路径（如 /oidc/callback），不在 hash 路由中。
 */
const start = async () => {
  const callbackHandled = await handleOidcCallback();
  if (callbackHandled) return;

  const app = createApp(App);
  app.use(createPinia());
  app.use(router);
  app.use(Antd);
  app.mount('#app');
};

start();
