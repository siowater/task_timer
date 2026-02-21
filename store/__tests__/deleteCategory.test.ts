/**
 * deleteCategory アクションの単体テスト
 * @see T-008-2 (#51)
 */

jest.mock('@/storage/mmkv');

import { useStore } from '../useStore';

function resetStore() {
  useStore.setState({
    categories: [],
    tasks: [],
    sessionLogs: [],
    activeTimers: [],
  });
}

beforeEach(() => {
  resetStore();
  jest.clearAllMocks();
});

describe('deleteCategory', () => {
  it('空のカテゴリーは削除できる', () => {
    useStore.getState().addCategory({ name: '削除対象', parentId: null, level: 1 });
    const { categories } = useStore.getState();
    const id = categories[0].id;

    const result = useStore.getState().deleteCategory(id);

    expect(result.success).toBe(true);
    expect(result.error).toBeUndefined();
    const { categories: after } = useStore.getState();
    expect(after).toHaveLength(0);
  });

  it('子カテゴリーがある場合は削除できない', () => {
    useStore.getState().addCategory({ name: '親', parentId: null, level: 1 });
    const parentId = useStore.getState().categories[0].id;
    useStore.getState().addCategory({ name: '子', parentId, level: 2 });

    const result = useStore.getState().deleteCategory(parentId);

    expect(result.success).toBe(false);
    expect(result.error).toBe('子カテゴリーまたはタスクが存在するため削除できません');
    const { categories } = useStore.getState();
    expect(categories).toHaveLength(2);
  });

  it('タスクがある場合は削除できない', () => {
    useStore.getState().addCategory({ name: 'カテゴリー', parentId: null, level: 1 });
    const categoryId = useStore.getState().categories[0].id;
    useStore.setState((state) => ({
      tasks: [
        ...state.tasks,
        {
          id: 'task-1',
          name: 'タスク',
          parentId: categoryId,
          order: 0,
          status: 'active' as const,
        },
      ],
    }));

    const result = useStore.getState().deleteCategory(categoryId);

    expect(result.success).toBe(false);
    expect(result.error).toBe('子カテゴリーまたはタスクが存在するため削除できません');
    const { categories } = useStore.getState();
    expect(categories).toHaveLength(1);
  });

  it('存在しないIDの場合はエラーを返す', () => {
    const result = useStore.getState().deleteCategory('non-existent-id');

    expect(result.success).toBe(false);
    expect(result.error).toBe('カテゴリーが見つかりません');
  });

  it('削除成功時は success: true を返す', () => {
    useStore.getState().addCategory({ name: 'テスト', parentId: null, level: 1 });
    const id = useStore.getState().categories[0].id;

    const result = useStore.getState().deleteCategory(id);

    expect(result.success).toBe(true);
  });
});
