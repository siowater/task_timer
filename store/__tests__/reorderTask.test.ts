/**
 * reorderTask アクションの単体テスト
 * @see T-015-2 (#57)
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

describe('reorderTask', () => {
  it('正常に並び替えできる（後ろへ移動）', () => {
    useStore.getState().addTask({ name: 'A', parentId: null });
    useStore.getState().addTask({ name: 'B', parentId: null });
    useStore.getState().addTask({ name: 'C', parentId: null });
    const { tasks } = useStore.getState();
    const idA = tasks.find((t) => t.name === 'A')!.id;

    useStore.getState().reorderTask(idA, 2);

    const { tasks: after } = useStore.getState();
    const sorted = [...after].sort((a, b) => a.order - b.order);
    expect(sorted.map((t) => t.name)).toEqual(['B', 'C', 'A']);
    expect(sorted.map((t) => t.order)).toEqual([0, 1, 2]);
  });

  it('正常に並び替えできる（前へ移動）', () => {
    useStore.getState().addTask({ name: 'A', parentId: null });
    useStore.getState().addTask({ name: 'B', parentId: null });
    useStore.getState().addTask({ name: 'C', parentId: null });
    const { tasks } = useStore.getState();
    const idC = tasks.find((t) => t.name === 'C')!.id;

    useStore.getState().reorderTask(idC, 0);

    const { tasks: after } = useStore.getState();
    const sorted = [...after].sort((a, b) => a.order - b.order);
    expect(sorted.map((t) => t.name)).toEqual(['C', 'A', 'B']);
    expect(sorted.map((t) => t.order)).toEqual([0, 1, 2]);
  });

  it('同一階層内の兄弟のみが並び替わる', () => {
    useStore.getState().addCategory({ name: '親', parentId: null, level: 1 });
    const parentId = useStore.getState().categories[0].id;
    useStore.getState().addTask({ name: '子A', parentId });
    useStore.getState().addTask({ name: '子B', parentId });
    useStore.getState().addTask({ name: '子C', parentId });
    useStore.getState().addTask({ name: 'ルート', parentId: null });

    const { tasks } = useStore.getState();
    const id子C = tasks.find((t) => t.name === '子C')!.id;

    useStore.getState().reorderTask(id子C, 0);

    const { tasks: after } = useStore.getState();
    const rootTasks = after.filter((t) => t.parentId === null);
    const childTasks = after.filter((t) => t.parentId === parentId);
    expect(rootTasks.map((t) => t.name)).toContain('ルート');
    const sortedChildren = [...childTasks].sort((a, b) => a.order - b.order);
    expect(sortedChildren.map((t) => t.name)).toEqual(['子C', '子A', '子B']);
  });

  it('存在しないIDの場合は何もしない', () => {
    useStore.getState().addTask({ name: 'A', parentId: null });

    useStore.getState().reorderTask('non-existent-id', 0);

    const { tasks } = useStore.getState();
    expect(tasks).toHaveLength(1);
    expect(tasks[0].order).toBe(0);
  });

  it('newOrder が同じ場合は何もしない', () => {
    useStore.getState().addTask({ name: 'A', parentId: null });
    useStore.getState().addTask({ name: 'B', parentId: null });
    const { tasks } = useStore.getState();
    const idA = tasks.find((t) => t.name === 'A')!.id;

    useStore.getState().reorderTask(idA, 0);

    const { tasks: after } = useStore.getState();
    const sorted = [...after].sort((a, b) => a.order - b.order);
    expect(sorted.map((t) => t.name)).toEqual(['A', 'B']);
  });
});
