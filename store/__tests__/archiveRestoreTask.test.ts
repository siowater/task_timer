/**
 * archiveTask / restoreTask アクションの単体テスト
 * @see T-014-3 (#62)
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

describe('archiveTask', () => {
  it('タスクの status を archived に更新する', () => {
    useStore.getState().addTask({ name: 'アーカイブ対象', parentId: null });
    const taskId = useStore.getState().tasks[0].id;

    useStore.getState().archiveTask(taskId);

    const { tasks } = useStore.getState();
    expect(tasks).toHaveLength(1);
    expect(tasks[0].status).toBe('archived');
  });

  it('計測中のタスクは ActiveTimer も削除する', () => {
    useStore.getState().addTask({ name: '計測中', parentId: null });
    const taskId = useStore.getState().tasks[0].id;
    useStore.setState((state) => ({
      activeTimers: [...state.activeTimers, { taskId, startTime: new Date().toISOString() }],
    }));

    useStore.getState().archiveTask(taskId);

    const { activeTimers } = useStore.getState();
    expect(activeTimers).toHaveLength(0);
  });

  it('存在しないIDでもエラーにならない', () => {
    expect(() => {
      useStore.getState().archiveTask('non-existent-id');
    }).not.toThrow();
  });

  it('既に archived のタスクはそのまま', () => {
    useStore.getState().addTask({ name: 'タスク', parentId: null });
    const taskId = useStore.getState().tasks[0].id;
    useStore.setState((state) => ({
      tasks: state.tasks.map((t) =>
        t.id === taskId ? { ...t, status: 'archived' as const } : t
      ),
    }));

    useStore.getState().archiveTask(taskId);

    const { tasks } = useStore.getState();
    expect(tasks[0].status).toBe('archived');
  });
});
