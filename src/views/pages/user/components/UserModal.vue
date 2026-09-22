<script setup lang="ts">
import type { RoleInfo } from '@/api/oidc/role/types';
import type { EditEnum as EditEnumType } from '@/constants/enums';
import type { FormInstance } from 'ant-design-vue/es/form/Form';
import type { Rule } from 'ant-design-vue/es/form';
import type { ValidateErrorEntity } from 'ant-design-vue/es/form/interface';
import type { DefaultOptionType } from 'ant-design-vue/es/vc-select/Select';

const open = defineModel('open', { default: false });

const props = withDefaults(defineProps<{
  userId?: number;
  type: EditEnumType;
}>(), {
  type: EditEnum.VIEW,
});

const emit = defineEmits<{
  (e: 'submit'): void;
}>();

const loading = ref(false);

const titleEnum = {
  [EditEnum.ADD]: '新增用户',
  [EditEnum.EDIT]: '编辑用户',
  [EditEnum.VIEW]: '查看用户',
};
const title = computed(() => titleEnum[props.type]);

const formRef = ref<FormInstance>();

const formData = ref<{
  username: string;
  password: string;
  roleIds: number[];
  enabled: boolean;
  newPassword: string;
}>({
  username: '',
  password: '',
  roleIds: [],
  enabled: true,
  newPassword: '',
});

const rules: Record<string, Rule[]> = {
  username: [{ required: true, message: '用户名不可为空' }],
  password: [{ required: true, message: '密码不可为空' }],
  newPassword: [{ min: 6, message: '密码至少 6 位' }],
};

/** 角色选项（来自角色列表接口） */
const roleOptions = ref<DefaultOptionType[]>([]);
const fetchRoles = async () => {
  try {
    const { success, data } = await getRoles();
    if (success && data) {
      roleOptions.value = data.map((role: RoleInfo) => ({
        value: role.id,
        label: role.name,
      }));
    }
  } catch {
    // 角色列表获取失败不阻塞表单，仅置空选项
    roleOptions.value = [];
  }
};
fetchRoles();

const handleSubmit = async () => {
  loading.value = true;
  try {
    await formRef.value?.validate();
    if (props.type === EditEnum.ADD) {
      const { success, msg } = await createUser({
        username: formData.value.username,
        password: formData.value.password,
        roleIds: formData.value.roleIds.length ? formData.value.roleIds : undefined,
        enabled: formData.value.enabled,
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
      const { success, msg } = await updateUser(props.userId!, {
        enabled: formData.value.enabled,
        // 传入则整体替换角色绑定
        roleIds: formData.value.roleIds,
      });
      if (success) {
        // 可选重置密码（免旧密码，重置后撤销该用户全部会话）
        if (formData.value.newPassword) {
          const reset = await resetUserPassword(props.userId!, { password: formData.value.newPassword });
          if (!reset.success) {
            message.error('密码重置失败：' + reset.msg);
            loading.value = false;
            return;
          }
        }
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
    username: '',
    password: '',
    roleIds: [],
    enabled: true,
    newPassword: '',
  };
};

const fetchDetail = async (userId: number) => {
  const { success, data } = await getUser(userId);
  if (success && data) {
    formData.value = {
      username: data.username,
      password: '',
      roleIds: data.roles.map((role) => role.id),
      enabled: data.enabled,
      newPassword: '',
    };
  }
};

watch(open, (v) => {
  if (v && props.userId && props.type !== EditEnum.ADD) {
    fetchDetail(props.userId);
  } else if (v && props.type === EditEnum.ADD) {
    // 重新打开新增弹窗时刷新角色选项
    fetchRoles();
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
    :width="560"
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
      <a-form-item label="用户名" name="username">
        <a-input v-model:value="formData.username" :disabled="!isAdd" placeholder="登录账号，创建后不可修改" />
      </a-form-item>
      <a-form-item v-if="isAdd" label="密码" name="password">
        <a-input-password v-model:value="formData.password" placeholder="登录密码" />
      </a-form-item>
      <a-form-item v-if="!isAdd && !isView" label="重置密码" name="newPassword">
        <a-input-password v-model:value="formData.newPassword" placeholder="留空则不修改密码" />
      </a-form-item>
      <a-form-item label="角色" name="roleIds">
        <a-select
          v-model:value="formData.roleIds"
          mode="multiple"
          :options="roleOptions"
          placeholder="选择角色，可多选"
          allow-clear
        />
      </a-form-item>
      <a-form-item label="状态" name="enabled">
        <a-switch
          v-model:checked="formData.enabled"
          checked-children="启用"
          un-checked-children="禁用"
        />
      </a-form-item>
    </a-form>
  </a-modal>
</template>
