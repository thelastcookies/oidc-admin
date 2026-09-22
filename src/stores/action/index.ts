import type { RecordName } from '@/types';
import type { ActionRecordRaw } from '@/types/action';
import type { TreeNode } from '@/utils/tree';

export const useActionStore = defineStore('action', () => {
  const actionTree = shallowRef([] as TreeNode<ActionRecordRaw>[]);

  /**
   * 获取 Actions 配置
   */
  const getActions = async () => {
    actionTree.value = staticActions;
    return actionTree.value;
  };


  const $reset = () => {
    actionTree.value = [] as TreeNode<ActionRecordRaw>[];
  };

  return {
    actionTree,
    getActions,
    $reset,
  };
});

/**
 * 根据查询条件查找 Action 配置
 * @param actions Actions
 * @param key 查询参数
 * @param field 被查询字段
 */
export const findAction = (
  actions: TreeNode<ActionRecordRaw>[],
  key: RecordName,
  field: 'id' | 'actionId' | 'title' = 'actionId',
): TreeNode<ActionRecordRaw> | undefined => {
  let action: TreeNode<ActionRecordRaw>;
  for (let i = 0, len = actions.length; i < len; i++) {
    if (actions[i][field] === key) {
      action = actions[i];
      return action;
    }
    if ('children' in actions[i]) {
      const p = findAction(
        actions[i].children!,
        key,
        field,
      );
      if (p) {
        return p;
      }
    }
  }
};

/**
 * 根据查询条件查找父级 Action 配置直到根节点
 * @param actions Actions
 * @param key 查询参数
 * @param field 被查询字段
 */
export const findActionAncestorChain = (
  actions: TreeNode<ActionRecordRaw>[],
  key: RecordName,
  field: 'id' | 'actionId' | 'title' = 'actionId',
): TreeNode<ActionRecordRaw>[] | undefined => {
  const action = findAction(actions, key, field)!;
  if (action) {
    if (action.pId) {
      return [action, ...findActionAncestorChain(actions, action.pId, 'id')!];
    } else {
      return [action];
    }
  } else {
    return undefined;
  }
};
