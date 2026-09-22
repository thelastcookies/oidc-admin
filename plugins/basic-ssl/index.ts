import type { PluginOption } from 'vite';
import basicSsl from '@vitejs/plugin-basic-ssl';

export const BasicSslPluginConfig: PluginOption = basicSsl({
  /** name of certification */
  name: 'oidc-admin',
  /** custom trust domains */
  // 与 .env/.env.development 中 APP_OIDC_REDIRECT_URI 的域名保持一致
  domains: ['10.0.0.10'],
});
