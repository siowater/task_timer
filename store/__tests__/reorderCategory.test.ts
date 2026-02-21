/**
 * reorderCategory アクションの単体テスト
 * @see T-009-2 (#45)
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

describe('reorderCategory', () => {
  it('正常に並び替えできる（後ろへ移動）', () => {
    useStore.getState().addCategory({ name: 'A', parentId: null, level: 1 });
    useStore.getState().addCategory({ name: 'B', parentId: null, level: 1 });
    useStore.getState().addCategory({ name: 'C', parentId: null, level: 1 });
    const { categories } = useStore.getState();
    const idA = categories.find((c) => c.name === 'A')!.id;

    useStore.getState().reorderCategory(idA, 2);

    const { categories: after } = useStore.getState();
    const sorted = [...after].sort((a, b) => a.order - b.order);
    expect(sorted.map((c) => c.name)).toEqual(['B', 'C', 'A']);
    expect(sorted.map((c) => c.order)).toEqual([0, 1, 2]);
  });

  it('正常に並び替えできる（前へ移動）', () => {
    useStore.getState().addCategory({ name: 'A', parentId: null, level: 1 });
    useStore.getState().addCategory({ name: 'B', parentId: null, level: 1 });
    useStore.getState().addCategory({ name: 'C', parentId: null, level: 1 });
    const { categories } = useStore.getState();
    const idC = categories.find((c) => c.name === 'C')!.id;

    useStore.getState().reorderCategory(idC, 0);

    const { categories: after } = useStore.getState();
    const sorted = [...after].sort((a, b) => a.order - b.order);
    expect(sorted.map((c) => c.name)).toEqual(['C', 'A', 'B']);
    expect(sorted.map((c) => c.order)).toEqual([0, 1, 2]);
  });

  it('同一階層内の兄弟のみが並び替わる', () => {
    useStore.getState().addCategory({ name: '親', parentId: null, level: 1 });
    const parentId = useStore.getState().categories[0].id;
    useStore.getState().addCategory({ name: '子A', parentId, level: 2 });
    useStore.getState().addCategory({ name: '子B', parentId, level: 2 });
    useStore.getState().addCategory({ name: '子C', parentId, level: 2 });
    useStore.getState().addCategory({ name: 'ルート2', parentId: null, level: 1 });

    const { categories } = useStore.getState();
    const id子C = categories.find((c) => c.name === '子C')!.id;

    useStore.getState().reorderCategory(id子C, 0);

    const { categories: after } = useStore.getState();
    const rootCategories = after.filter((c) => c.parentId === null);
    const childCategories = after.filter((c) => c.parentId === parentId);
    expect(rootCategories.map((c) => c.name)).toContain('親');
    expect(rootCategories.map((c) => c.name)).toContain('ルート2');
    const sortedChildren = [...childCategories].sort((a, b) => a.order - b.order);
    expect(sortedChildren.map((c) => c.name)).toEqual(['子C', '子A', '子B']);
  });

  it('存在しないIDの場合は何もしない', () => {
    useStore.getState().addCategory({ name: 'A', parentId: null, level: 1 });

    useStore.getState().reorderCategory('non-existent-id', 0);

    const { categories } = useStore.getState();
    expect(categories).toHaveLength(1);
    expect(categories[0].order).toBe(0);
  });

  it('newOrder が同じ場合は何もしない', () => {
    useStore.getState().addCategory({ name: 'A', parentId: null, level: 1 });
    useStore.getState().addCategory({ name: 'B', parentId: null, level: 1 });
    const { categories } = useStore.getState();
    const idA = categories.find((c) => c.name === 'A')!.id;

    useStore.getState().reorderCategory(idA, 0);

    const { categories: after } = useStore.getState();
    const sorted = [...after].sort((a, b) => a.order - b.order);
    expect(sorted.map((c) => c.name)).toEqual(['A', 'B']);
  });
});
