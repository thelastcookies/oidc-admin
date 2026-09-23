<script setup lang="ts">
import type { RoleInfo } from '@/api/oidc/role/types';

/** 内置管理员角色编码（不允许删除） */
const ADMIN_ROLE_CODE = 'admin';

const allRoles = ref<RoleInfo[]>([]);
const list = ref<RoleInfo[]>([]);
const loading = ref(false);
const qForm = ref<Recordable<any>>({});

const fetch = async () => {
  loading.value = true;
  try {
    const { success, data } = await getRoles();
    if (success && data) {
      allRoles.value = data;
      const kw = qForm.value.keyword || '';
      list.value = kw
        ? data.filter((item: RoleInfo) =>
            item.code.includes(kw)
            || item.name.includes(kw),
          )
        : data;
    }
  } catch {
    message.error('获取角色列表失败');
  }
  loading.value = false;
};

fetch();

const handleReload = async () => {
  await fetch();
};

/**
 * 模态框
 */
const modalOpen = ref(false);
const modalType = ref(EditEnum.ADD);
const modalRole = ref<RoleInfo>();

const handleEdit = (type: EditEnum, record?: RoleInfo) => {
  modalOpen.value = true;
  modalType.value = type;
  modalRole.value = record;
};

const handleDelete = async (id: number) => {
  try {
    const { success, msg } = await deleteRole(id);
    if (success) {
      message.success('删除成功');
      await handleReload();
    } else {
      message.error('删除失败：' + msg);
    }
  } catch {
    message.error('删除失败');
  }
};

const onQuery = () => {
  fetch();
};
</script>

<template>
  <div class="w-full h-full p-3 flex flex-col">
    <QueryForm
      class="py-2"
      :fields="roleTableSearchFields"
      v-model:form="qForm"
      @query="onQuery"
    />
    <FixedTable
      class="flex-1"
      id="role-table"
      row-key="id"
      :loading="loading"
      :columns="roleTableColumns"
      :data-source="list"
      :pagination="false"
    >
      <template #title>
        <div class="flex">
          <div>角色列表</div>
          <a-button ml-auto type="primary" @click="handleEdit(EditEnum.ADD)">
            <BaseIcon icon="i-mdi-plus" />
            新增
          </a-button>
        </div>
      </template>
      <template #bodyCell="{ column, record }">
        <template v-if="column.dataIndex === 'operation'">
          <a-button btn-in-table type="link" @click="handleEdit(EditEnum.VIEW, record as RoleInfo)">查看</a-button>
          <a-divider type="vertical" />
          <a-button btn-in-table type="link" @click="handleEdit(EditEnum.EDIT, record as RoleInfo)">编辑</a-button>
          <a-divider v-if="(record as RoleInfo).code !== ADMIN_ROLE_CODE" type="vertical" />
          <a-popconfirm
            v-if="(record as RoleInfo).code !== ADMIN_ROLE_CODE"
            title="此操作不可撤销，确定删除？"
            @confirm="handleDelete((record as RoleInfo).id)"
          >
            <a-button btn-in-table danger type="link">删除</a-button>
          </a-popconfirm>
        </template>
      </template>
    </FixedTable>
    <RoleModal
      v-model:open="modalOpen"
      :type="modalType"
      :role-record="modalRole"
      @submit="handleReload"
    />
  </div>
</template>
