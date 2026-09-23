import type { TableColumnProps } from 'ant-design-vue';
import type { RoleBrief } from '@/api/oidc/user/types';

export const userTableColumns: TableColumnProps[] = [
  {
    title: 'ID',
    dataIndex: 'id',
    width: 80,
  },
  {
    title: '用户名',
    dataIndex: 'username',
    width: 160,
  },
  {
    title: '真实姓名',
    dataIndex: 'realName',
    width: 140,
    customRender: ({ text }: { text: string | null }) => {
      return text || '-';
    },
  },
  {
    title: '角色',
    dataIndex: 'roles',
    width: 240,
    customRender: ({ text }: { text: RoleBrief[] }) => {
      return text?.length
        ? h('div', text.map((role: RoleBrief) => h(Tag, { color: 'blue', class: 'mr-1 mb-1', title: role.code }, () => role.name)))
        : '-';
    },
  },
  {
    title: '状态',
    dataIndex: 'enabled',
    width: 100,
    customRender: ({ text }: { text: boolean }) => {
      return text
        ? h(Tag, { color: 'green' }, () => '启用')
        : h(Tag, { color: 'red' }, () => '禁用');
    },
  },
  {
    title: '创建时间',
    dataIndex: 'createdAt',
    width: 180,
    customRender: ({ text }: { text: string }) => {
      return text ? dayjs(text).format('YYYY-MM-DD HH:mm:ss') : '-';
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

export const userTableSearchFields: QueryFormField[] = [
  {
    label: '关键字',
    field: 'keyword',
    component: 'Input',
    compProps: {
      placeholder: '搜索用户名',
    },
  },
];
