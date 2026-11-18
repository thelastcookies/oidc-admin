import type { TableColumnProps } from 'ant-design-vue';

/** 授权类型选项 */
export const grantTypeOptions = [
  {
    label: 'authorization_code',
    value: 'authorization_code',
    title: '授权码模式。最主流、最安全的流程。',
  },
  {
    label: 'refresh_token',
    value: 'refresh_token',
    title: '刷新令牌模式。允许你的应用在访问令牌过期后，静默地换取新的令牌，以延长用户会话，避免频繁要求用户重新登录。',
  },
  {
    label: 'client_credentials',
    value: 'client_credentials',
    title: '一种属于 OAuth 2.0 的授权类型。专为无用户参与的服务器到服务器或机器到机器的通信场景设计。',
  },
  {
    label: 'implicit',
    value: 'implicit',
    title: '隐式模式，一种简化的令牌获取方式。用户认证通过后，ID Token 和/或 Access Token 通过浏览器的重定向返回给客户端。因安全性问题已不推荐用于现代应用。',
  },
];

/** 响应类型选项 */
export const responseTypeOptions = [
  {
    label: 'code',
    value: 'code',
    title: '授权码模式的标准响应。授权端点返回一个一次性的 code，Client/RP 接收后，再通过后端通道去令牌端点换取真正的令牌。授权类型包含 authorization_code 时，响应类型必须包含 code。',
  },
  {
    label: 'id_token',
    value: 'id_token',
    title: '主要用于隐式模式，请求 ID Token（用于纯 OIDC 身份认证）。',
  },
  {
    label: 'token',
    value: 'token',
    title: '主要用于隐式模式，请求 Access Token。',
  },
];

/** 令牌端点认证方式选项 */
export const tokenAuthMethodOptions = [
  {
    label: 'client_secret_post',
    value: 'client_secret_post',
    title: '将 client_id 和 client_secret 进行 Base64 编码后，放在 HTTP 的 Authorization 请求头里发送。这是 RFC 标准中的默认值，也是 Okta 等平台的默认方式。',
  },
  {
    label: 'client_secret_basic',
    value: 'client_secret_basic',
    title: '将 client_id 和 client_secret 作为请求体（Body）中的表单参数发送。一些实现简单的 IdP 可能只支持这种方式。',
  },
  {
    label: 'none',
    value: 'none',
    title: '表示这是一个公共客户端（Public Client），没有 client_secret。这适用于无法安全保存密钥的场景，如纯前端单页应用（SPA）或移动 App。它们通常需要配合 PKCE 来保证授权码流程的安全。',
  },
];

export const clientTableColumns: TableColumnProps[] = [
  {
    title: '客户端 ID',
    dataIndex: 'client_id',
    width: 140,
  },
  {
    title: '客户端名称',
    dataIndex: 'client_name',
    width: 140,
  },
  {
    title: '回调地址',
    dataIndex: 'redirect_uris',
    width: 280,
    customRender: ({ text }: { text: string[] }) => {
      return h('div', text?.map((uri: string) => h('div', { class: 'text-12px break-all' }, uri)));
    },
  },
  {
    title: '登出回调地址',
    dataIndex: 'post_logout_redirect_uris',
    width: 280,
    customRender: ({ text }: { text: string[] }) => {
      return h('div', text?.map((uri: string) => h('div', { class: 'text-12px break-all' }, uri)));
    },
  },
  {
    title: '授权类型',
    dataIndex: 'grant_types',
    width: 200,
    customRender: ({ text }: { text: string[] }) => {
      return h('div', text?.map((gt: string) => h(Tag, { color: 'blue', class: 'mr-1 mb-1' }, () => gt)));
    },
  },
  {
    title: '响应类型',
    dataIndex: 'response_types',
    width: 120,
    customRender: ({ text }: { text: string[] }) => {
      return h('div', text?.map((rt: string) => h(Tag, { color: 'green', class: 'mr-1 mb-1' }, () => rt)));
    },
  },
  {
    title: '认证方式',
    dataIndex: 'token_endpoint_auth_method',
    width: 120,
    customRender: ({ text }: { text: string[] }) => {
      return h(Tag, { color: 'cyan', class: 'mr-1 mb-1' }, () => text);
    },
  },
  {
    title: '更新时间',
    dataIndex: 'updatedAt',
    width: 180,
    customRender: ({ text }: { text: string }) => {
      return text ? dayjs(text).format('YYYY-MM-DD HH:mm:ss') : '-';
    },
  },
  {
    title: '操作',
    width: 160,
    dataIndex: 'operation',
    className: 'un-export-column',
  },
];

export const clientTableSearchFields: QueryFormField[] = [
  {
    label: '关键字',
    field: 'keyword',
    component: 'Input',
    compProps: {
      placeholder: '搜索客户端 ID 或名称',
    },
  },
];
