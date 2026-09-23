<script setup lang="ts">
import type { TablePaginationConfig } from 'ant-design-vue';
import type { UserInfo } from '@/api/oidc/user/types';

const list = ref<UserInfo[]>([]);
const loading = ref(false);
const qForm = ref<Recordable<any>>({});

const pagination = ref({
  total: 0,
  current: 1,
  pageSize: 20,
  showSizeChanger: true,
});

const fetch = async () => {
  loading.value = true;
  try {
    const { success, data } = await getUsers({
      page: pagination.value.current,
      pageSize: pagination.value.pageSize,
      keyword: qForm.value.keyword || undefined,
    });
    if (success && data) {
      list.value = data.list;
      pagination.value.total = data.total;
    }
  } catch {
    message.error('获取用户列表失败');
  }
  loading.value = false;
};

fetch();

const handleTableChange = ({ current, pageSize }: TablePaginationConfig) => {
  pagination.value.current = current ?? 1;
  pagination.value.pageSize = pageSize ?? 20;
  fetch();
};

const handleReload = async () => {
  await fetch();
};

/**
 * 模态框
 */
const modalOpen = ref(false);
const modalType = ref(EditEnum.ADD);
const modalUserId = ref(0);

const handleEdit = (type: EditEnum, record?: UserInfo) => {
  modalOpen.value = true;
  modalType.value = type;
  modalUserId.value = record?.id ?? 0;
};

const handleDelete = async (id: number) => {
  try {
    const { success, msg } = await deleteUser(id);
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
  pagination.value.current = 1;
  fetch();
};
</script>

<template>
  <div class="w-full h-full p-3 flex flex-col">
    <QueryForm
      class="py-2"
      :fields="userTableSearchFields"
      v-model:form="qForm"
      @query="onQuery"
    />
    <FixedTable
      class="flex-1"
      id="user-table"
      row-key="id"
      :loading="loading"
      :columns="userTableColumns"
      :data-source="list"
      :pagination="pagination"
      @change="handleTableChange"
    >
      <template #title>
        <div class="flex">
          <div>用户列表</div>
          <a-button ml-auto type="primary" @click="handleEdit(EditEnum.ADD)">
            <BaseIcon icon="i-mdi-plus" />
            新增
          </a-button>
        </div>
      </template>
      <template #bodyCell="{ column, record }">
        <template v-if="column.dataIndex === 'operation'">
          <a-button btn-in-table type="link" @click="handleEdit(EditEnum.VIEW, record as UserInfo)">查看</a-button>
          <a-divider type="vertical" />
          <a-button btn-in-table type="link" @click="handleEdit(EditEnum.EDIT, record as UserInfo)">编辑</a-button>
          <a-divider type="vertical" />
          <a-popconfirm
            title="此操作不可撤销，确定删除？"
            @confirm="handleDelete((record as UserInfo).id)"
          >
            <a-button btn-in-table danger type="link">删除</a-button>
          </a-popconfirm>
        </template>
      </template>
    </FixedTable>
    <UserModal
      v-model:open="modalOpen"
      :type="modalType"
      :user-id="modalUserId"
      @submit="handleReload"
    />
  </div>
</template>
