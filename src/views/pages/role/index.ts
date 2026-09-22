import type { TableColumnProps } from 'ant-design-vue';

export const roleTableColumns: TableColumnProps[] = [
  {
    title: 'ID',
    dataIndex: 'id',
    width: 80,
  },
  {
    title: '角色编码',
    dataIndex: 'code',
    width: 160,
    customRender: ({ text }: { text: string }) => {
      return h(Tag, { color: 'geekblue' }, () => text);
    },
  },
  {
    title: '角色名称',
    dataIndex: 'name',
    width: 160,
  },
  {
    title: '备注',
    dataIndex: 'remark',
    width: 240,
    customRender: ({ text }: { text: string | null }) => {
      return text || '-';
    },
  },
  {
    title: '用户数',
    dataIndex: 'userCount',
    width: 100,
    customRender: ({ text }: { text: number }) => {
      return h(Tag, { color: 'blue' }, () => text);
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
    title: '操作',
    width: 160,
    dataIndex: 'operation',
    className: 'un-export-column',
  },
];

export const roleTableSearchFields: QueryFormField[] = [
  {
    label: '关键字',
    field: 'keyword',
    component: 'Input',
    compProps: {
      placeholder: '搜索角色编码或名称',
    },
  },
];
