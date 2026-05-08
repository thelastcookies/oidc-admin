/** OIDC 服务端统一响应格式 */
export interface OidcResponseBody<T = any> {
  success: boolean;
  code: number;
  msg: string;
  data?: T;
  detail?: string | null;
}
