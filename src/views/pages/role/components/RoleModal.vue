<script setup lang="ts">
import type { RoleInfo } from '@/api/oidc/role/types';
import type { EditEnum as EditEnumType } from '@/constants/enums';
import type { FormInstance } from 'ant-design-vue/es/form/Form';
import type { Rule } from 'ant-design-vue/es/form';
import type { ValidateErrorEntity } from 'ant-design-vue/es/form/interface';

const open = defineModel('open', { default: false });

const props = withDefaults(defineProps<{
  // 角色无单查接口，编辑/查看时由列表行数据传入
  roleRecord?: RoleInfo;
  type: EditEnumType;
}>(), {
  type: EditEnum.VIEW,
});

const emit = defineEmits<{
  (e: 'submit'): void;
}>();

const loading = ref(false);

const titleEnum = {
  [EditEnum.ADD]: '新增角色',
  [EditEnum.EDIT]: '编辑角色',
  [EditEnum.VIEW]: '查看角色',
};
const title = computed(() => titleEnum[props.type]);

const formRef = ref<FormInstance>();

const formData = ref<{
  code: string;
  name: string;
  remark: string;
}>({
  code: '',
  name: '',
  remark: '',
});

const rules: Record<string, Rule[]> = {
  code: [{ required: true, message: '角色编码不可为空' }],
  name: [{ required: true, message: '角色名称不可为空' }],
};

const handleSubmit = async () => {
  loading.value = true;
  try {
    await formRef.value?.validate();
    if (props.type === EditEnum.ADD) {
      const { success, msg } = await createRole({
        code: formData.value.code,
        name: formData.value.name,
        remark: formData.value.remark || undefined,
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
      const { success, msg } = await updateRole(props.roleRecord!.id, {
        name: formData.value.name,
        remark: formData.value.remark || undefined,
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
    code: '',
    name: '',
    remark: '',
  };
};

watch(open, (v) => {
  if (v && props.roleRecord && props.type !== EditEnum.ADD) {
    formData.value = {
      code: props.roleRecord.code,
      name: props.roleRecord.name,
      remark: props.roleRecord.remark || '',
    };
  } else if (v && props.type === EditEnum.ADD) {
    formData.value = { code: '', name: '', remark: '' };
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
    :width="520"
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
      <a-form-item label="角色编码" name="code">
        <a-input v-model:value="formData.code" :disabled="!isAdd" placeholder="下发到 claims 的角色标识，创建后不可修改" />
      </a-form-item>
      <a-form-item label="角色名称" name="name">
        <a-input v-model:value="formData.name" placeholder="展示名称，如 管理员" />
      </a-form-item>
      <a-form-item label="备注" name="remark">
        <a-textarea v-model:value="formData.remark" placeholder="可选" :rows="3" />
      </a-form-item>
    </a-form>
  </a-modal>
</template>
