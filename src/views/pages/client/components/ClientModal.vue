<script setup lang="ts">
import type { ClientInfo } from '@/api/oidc/client/types';
import type { EditEnum as EditEnumType } from '@/constants/enums';
import type { FormInstance } from 'ant-design-vue/es/form/Form';
import type { Rule } from 'ant-design-vue/es/form';
import type { ValidateErrorEntity } from 'ant-design-vue/es/form/interface';

const open = defineModel('open', { default: false });

const props = withDefaults(defineProps<{
  clientId?: string;
  type: EditEnumType;
}>(), {
  type: EditEnum.VIEW,
});

const emit = defineEmits<{
  (e: 'submit'): void;
}>();

const loading = ref(false);

const titleEnum = {
  [EditEnum.ADD]: '新增客户端',
  [EditEnum.EDIT]: '编辑客户端',
  [EditEnum.VIEW]: '查看客户端',
};
const title = computed(() => titleEnum[props.type]);

const formRef = ref<FormInstance>();

const formData = ref<{
  client_id: string;
  client_secret: string;
  client_name: string;
  redirect_uris: string[];
  post_logout_redirect_uris: string[];
  grant_types: string[];
  response_types: string[];
  token_endpoint_auth_method: string;
}>({
  client_id: '',
  client_secret: '',
  client_name: '',
  redirect_uris: [],
  post_logout_redirect_uris: [],
  grant_types: ['authorization_code', 'refresh_token'],
  response_types: ['code'],
  token_endpoint_auth_method: 'client_secret_post',
});

const rules: Record<string, Rule[]> = {
  client_id: [{ required: true, message: '客户端 ID 不可为空' }],
  client_secret: [{ required: true, message: '客户端密钥不可为空' }],
  redirect_uris: [{ required: true, message: '回调地址不可为空' }],
};

/** 动态输入框：回调地址 */
const newRedirectUri = ref('');
const addRedirectUri = () => {
  const uri = newRedirectUri.value.trim();
  if (uri && !formData.value.redirect_uris.includes(uri)) {
    formData.value.redirect_uris.push(uri);
    newRedirectUri.value = '';
  }
};
const removeRedirectUri = (index: number) => {
  formData.value.redirect_uris.splice(index, 1);
};

/** 动态输入框：登出回调地址 */
const newPostLogoutUri = ref('');
const addPostLogoutUri = () => {
  const uri = newPostLogoutUri.value.trim();
  if (uri && !formData.value.post_logout_redirect_uris.includes(uri)) {
    formData.value.post_logout_redirect_uris.push(uri);
    newPostLogoutUri.value = '';
  }
};
const removePostLogoutUri = (index: number) => {
  formData.value.post_logout_redirect_uris.splice(index, 1);
};

const handleSubmit = async () => {
  loading.value = true;
  try {
    await formRef.value?.validate();
    if (props.type === EditEnum.ADD) {
      const { success, msg } = await createClient({
        client_id: formData.value.client_id,
        client_secret: formData.value.client_secret,
        redirect_uris: formData.value.redirect_uris,
        client_name: formData.value.client_name || undefined,
        post_logout_redirect_uris: formData.value.post_logout_redirect_uris.length ? formData.value.post_logout_redirect_uris : undefined,
        grant_types: formData.value.grant_types,
        response_types: formData.value.response_types,
        token_endpoint_auth_method: formData.value.token_endpoint_auth_method as any || undefined,
      });
      if (success) {
        message.success('创建成功');
        emit('submit');
        handleClear();
        open.value = false;
      } else {
        message.error('创建失败：' + msg);
      }
    } else if (props.type === EditEnum.EDIT) {
      const { success, msg } = await updateClient(props.clientId!, {
        client_name: formData.value.client_name || undefined,
        redirect_uris: formData.value.redirect_uris,
        post_logout_redirect_uris: formData.value.post_logout_redirect_uris,
        grant_types: formData.value.grant_types,
        response_types: formData.value.response_types,
      });
      if (success) {
        message.success('更新成功');
        emit('submit');
        handleClear();
        open.value = false;
      } else {
        message.error('更新失败：' + msg);
      }
    }
  } catch (e) {
    if ((e as ValidateErrorEntity)?.errorFields) {
      message.error((e as ValidateErrorEntity).errorFields[0].errors[0]);
    } else {
      message.error('操作失败');
    }
  }
  loading.value = false;
};

const handleClear = () => {
  formRef.value?.resetFields();
  formData.value = {
    client_id: '',
    client_secret: '',
    client_name: '',
    redirect_uris: [],
    post_logout_redirect_uris: [],
    grant_types: ['authorization_code', 'refresh_token'],
    response_types: ['code'],
    token_endpoint_auth_method: 'client_secret_post',
  };
  newRedirectUri.value = '';
  newPostLogoutUri.value = '';
};

const fetchDetail = async (clientId: string) => {
  const { success, data } = await getClient(clientId);
  if (success && data) {
    formData.value = {
      client_id: data.client_id,
      client_secret: '',
      client_name: data.client_name,
      redirect_uris: [...data.redirect_uris],
      post_logout_redirect_uris: [...(data.post_logout_redirect_uris || [])],
      grant_types: [...data.grant_types],
      response_types: [...data.response_types],
      token_endpoint_auth_method: data.token_endpoint_auth_method || 'client_secret_post',
    };
  }
};

watch(open, (v) => {
  if (v && props.clientId && props.type !== EditEnum.ADD) {
    fetchDetail(props.clientId);
  }
});

const isView = computed(() => props.type === EditEnum.VIEW);
const isAdd = computed(() => props.type === EditEnum.ADD);
</script>

<template>
  <a-modal
    v-model:open="open"
    :title="title"
    :confirm-loading="loading"
    ok-text="保存"
    :width="640"
    @ok="handleSubmit"
    @cancel="handleClear"
  >
    <a-form
      ref="formRef"
      :model="formData"
      :label-col="{ span: 5 }"
      :wrapper-col="{ span: 18 }"
      :rules="rules"
      :disabled="isView || loading"
      class="px-4 pt-4"
    >
      <a-form-item label="客户端 ID" name="client_id">
        <a-input v-model:value="formData.client_id" :disabled="!isAdd" placeholder="唯一标识，如 my-app" />
      </a-form-item>
      <a-form-item v-if="isAdd" label="客户端密钥" name="client_secret">
        <a-input-password v-model:value="formData.client_secret" placeholder="用于 OIDC 认证的密钥" />
      </a-form-item>
      <a-form-item label="客户端名称" name="client_name">
        <a-input v-model:value="formData.client_name" placeholder="可选，默认与客户端 ID 相同" />
      </a-form-item>

      <!-- 回调地址 -->
      <a-form-item label="回调地址" name="redirect_uris" :required="isAdd">
        <div class="w-full">
          <div v-for="(uri, index) in formData.redirect_uris" :key="index" class="flex items-center mb-1">
            <a-input :value="uri" disabled class="flex-1" />
            <a-button v-if="!isView" type="link" danger @click="removeRedirectUri(index)">
              <BaseIcon icon="i-mdi-close-circle" />
            </a-button>
          </div>
          <div v-if="!isView" class="flex gap-1">
            <a-input v-model:value="newRedirectUri" placeholder="输入回调 URI 后回车添加" class="flex-1" @press-enter="addRedirectUri" />
            <a-button type="dashed" @click="addRedirectUri">
              <BaseIcon icon="i-mdi-plus" />
            </a-button>
          </div>
        </div>
      </a-form-item>

      <!-- 登出回调地址 -->
      <a-form-item label="登出回调地址" name="post_logout_redirect_uris">
        <div class="w-full">
          <div v-for="(uri, index) in formData.post_logout_redirect_uris" :key="index" class="flex items-center mb-1">
            <a-input :value="uri" disabled class="flex-1" />
            <a-button v-if="!isView" type="link" danger @click="removePostLogoutUri(index)">
              <BaseIcon icon="i-mdi-close-circle" />
            </a-button>
          </div>
          <div v-if="!isView" class="flex gap-1">
            <a-input v-model:value="newPostLogoutUri" placeholder="输入登出回调 URI 后回车添加" class="flex-1" @press-enter="addPostLogoutUri" />
            <a-button type="dashed" @click="addPostLogoutUri">
              <BaseIcon icon="i-mdi-plus" />
            </a-button>
          </div>
        </div>
      </a-form-item>

      <a-form-item label="授权类型" name="grant_types">
        <a-select v-model:value="formData.grant_types" mode="multiple" :options="grantTypeOptions" placeholder="选择授权类型" />
      </a-form-item>
      <a-form-item label="响应类型" name="response_types">
        <a-select v-model:value="formData.response_types" mode="multiple" :options="responseTypeOptions" placeholder="选择响应类型" />
      </a-form-item>
      <a-form-item label="认证方式" name="token_endpoint_auth_method">
        <a-select v-model:value="formData.token_endpoint_auth_method" :options="tokenAuthMethodOptions" placeholder="选择令牌端点认证方式" />
      </a-form-item>
    </a-form>
  </a-modal>
</template>
