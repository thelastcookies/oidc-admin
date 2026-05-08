import type { TableColumnProps } from 'ant-design-vue';

/** 授权类型选项 */
export const grantTypeOptions = [
  { label: 'authorization_code', value: 'authorization_code' },
  { label: 'refresh_token', value: 'refresh_token' },
  { label: 'client_credentials', value: 'client_credentials' },
  { label: 'implicit', value: 'implicit' },
];

/** 响应类型选项 */
export const responseTypeOptions = [
  { label: 'code', value: 'code' },
  { label: 'id_token', value: 'id_token' },
  { label: 'token', value: 'token' },
];

/** 令牌端点认证方式选项 */
export const tokenAuthMethodOptions = [
  { label: 'client_secret_post', value: 'client_secret_post' },
  { label: 'client_secret_basic', value: 'client_secret_basic' },
  { label: 'none', value: 'none' },
];

export const clientTableColumns: TableColumnProps[] = [
  {
    title: '客户端 ID',
    dataIndex: 'client_id',
    width: 160,
  },
  {
    title: '客户端名称',
    dataIndex: 'client_name',
    width: 160,
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
