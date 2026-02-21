/**
 * addCategory アクションの単体テスト
 * @see T-007-2 (#43)
 */

jest.mock('@/storage/mmkv');

import { useStore } from '../useStore';
import { MAX_CATEGORY_LEVEL } from '@/constants/app';

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

describe('addCategory', () => {
  it('正常にカテゴリーを追加する', () => {
    useStore.getState().addCategory({
      name: '仕事',
      parentId: null,
      level: 1,
    });

    const { categories } = useStore.getState();
    expect(categories).toHaveLength(1);
    expect(categories[0]).toMatchObject({
      name: '仕事',
      parentId: null,
      order: 0,
      level: 1,
    });
    expect(categories[0].id).toBeDefined();
    expect(categories[0].createdAt).toBeDefined();
  });

  it('複数追加時は order が連番になる', () => {
    useStore.getState().addCategory({ name: 'A', parentId: null, level: 1 });
    useStore.getState().addCategory({ name: 'B', parentId: null, level: 1 });
    useStore.getState().addCategory({ name: 'C', parentId: null, level: 1 });

    const { categories } = useStore.getState();
    expect(categories).toHaveLength(3);
    expect(categories.map((c) => c.order)).toEqual([0, 1, 2]);
  });

  it('同一 parentId の兄弟のみで order を計算する', () => {
    useStore.getState().addCategory({ name: '親1', parentId: null, level: 1 });
    const parentId = useStore.getState().categories[0].id;
    useStore.getState().addCategory({ name: '子1', parentId, level: 2 });
    useStore.getState().addCategory({ name: '子2', parentId, level: 2 });
    useStore.getState().addCategory({ name: 'ルート2', parentId: null, level: 1 });

    const { categories } = useStore.getState();
    const rootCategories = categories.filter((c) => c.parentId === null);
    const childCategories = categories.filter((c) => c.parentId === parentId);

    expect(rootCategories.map((c) => c.order)).toEqual([0, 1]);
    expect(childCategories.map((c) => c.order)).toEqual([0, 1]);
  });

  it('Level 4 では追加しない', () => {
    useStore.getState().addCategory({
      name: 'Level4カテゴリー',
      parentId: null,
      level: MAX_CATEGORY_LEVEL,
    });

    const { categories } = useStore.getState();
    expect(categories).toHaveLength(0);
  });

  it('空文字・空白のみでは追加しない', () => {
    useStore.getState().addCategory({ name: '', parentId: null, level: 1 });
    useStore.getState().addCategory({ name: '   ', parentId: null, level: 1 });
    useStore.getState().addCategory({ name: '\t\n', parentId: null, level: 1 });

    const { categories } = useStore.getState();
    expect(categories).toHaveLength(0);
  });

  it('前後の空白はトリムされる', () => {
    useStore.getState().addCategory({
      name: '  学習  ',
      parentId: null,
      level: 1,
    });

    const { categories } = useStore.getState();
    expect(categories).toHaveLength(1);
    expect(categories[0].name).toBe('学習');
  });
});
