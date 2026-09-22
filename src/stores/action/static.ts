import type { ActionRecordRaw } from '@/types/action';

export const staticActions = createTree<ActionRecordRaw>([
  {
    id: '1636643442430447616',
    actionId: 'oidc',
    title: 'OIDC 管理',
    type: MenuTypeEnum.MENU,
    icon: 'i-mdi-certificate',
    sort: 1,
    showInMenu: true,
    url: 'oidc',
    children: [
      {
        id: '1636652592875048960',
        pId: '1636643442430447616',
        actionId: 'clientMng',
        title: '客户端管理',
        type: MenuTypeEnum.PAGE,
        sort: 11,
        showInMenu: true,
        url: 'client',
        resource: 'pages/client/Index.vue',
      },
      {
        id: '1536652666153734144',
        pId: '1636643442430447616',
        actionId: 'userMng',
        title: '用户管理',
        type: MenuTypeEnum.PAGE,
        sort: 12,
        showInMenu: true,
        url: 'user',
        resource: 'pages/user/Index.vue',
      },
      {
        id: '1536652853853032448',
        pId: '1636643442430447616',
        actionId: 'roleMng',
        title: '角色管理',
        type: MenuTypeEnum.PAGE,
        sort: 13,
        showInMenu: true,
        url: 'role',
        resource: 'pages/role/Index.vue',
      },
    ],
  },
]);
