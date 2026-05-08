<script setup lang="ts">
import type { ClientInfo } from '@/api/oidc/client/types';

const list = ref<ClientInfo[]>([]);
const loading = ref(false);
const qForm = ref<Recordable<any>>({});

const modalOpen = ref(false);
const modalType = ref(EditEnum.ADD);
const modalClientId = ref('');

const fetch = async () => {
  loading.value = true;
  try {
    const { success, data } = await getClientList();
    if (success && data) {
      const kw = qForm.value.keyword || '';
      list.value = kw
        ? data.filter((item: ClientInfo) =>
            item.client_id.includes(kw)
            || item.client_name.includes(kw),
          )
        : data;
    }
  } catch {
    message.error('获取客户端列表失败');
  }
  loading.value = false;
};

fetch();

const handleReload = async () => {
  await fetch();
};

const handleEdit = (type: EditEnum, record?: ClientInfo) => {
  modalOpen.value = true;
  modalType.value = type;
  if (type === EditEnum.EDIT && record) {
    modalClientId.value = record.client_id;
  } else if (type === EditEnum.ADD) {
    modalClientId.value = '';
  } else if (type === EditEnum.VIEW && record) {
    modalClientId.value = record.client_id;
  }
};

const handleDelete = async (clientId: string) => {
  try {
    const { success, msg } = await deleteClient(clientId);
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
      :fields="clientTableSearchFields"
      v-model:form="qForm"
      @query="onQuery"
    />
    <FixedTable
      class="flex-1"
      id="client-table"
      row-key="client_id"
      :loading="loading"
      :columns="clientTableColumns"
      :data-source="list"
      :pagination="false"
    >
      <template #title>
        <div class="flex">
          <div>客户端列表</div>
          <a-button ml-auto type="primary" @click="handleEdit(EditEnum.ADD)">
            <BaseIcon icon="i-mdi-plus" />
            新增
          </a-button>
        </div>
      </template>
      <template #bodyCell="{ column, record }">
        <template v-if="column.dataIndex === 'operation'">
          <a-button btn-in-table type="link" @click="handleEdit(EditEnum.VIEW, record as ClientInfo)">查看</a-button>
          <a-divider type="vertical" />
          <a-button btn-in-table type="link" @click="handleEdit(EditEnum.EDIT, record as ClientInfo)">编辑</a-button>
          <a-divider type="vertical" />
          <a-popconfirm
            title="确定要删除此客户端吗？"
            @confirm="handleDelete((record as ClientInfo).client_id)"
          >
            <a-button btn-in-table danger type="link">删除</a-button>
          </a-popconfirm>
        </template>
      </template>
    </FixedTable>
    <ClientModal
      v-model:open="modalOpen"
      :type="modalType"
      :client-id="modalClientId"
      @submit="handleReload"
    />
  </div>
</template>
