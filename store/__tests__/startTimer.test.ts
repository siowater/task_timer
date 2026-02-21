/**
 * startTimer アクションの単体テスト
 * @see T-017-1 (#67)
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

describe('startTimer', () => {
  it('ActiveTimer に taskId と startTime を追加する', () => {
    useStore.getState().addTask({ name: 'タスク', parentId: null });
    const taskId = useStore.getState().tasks[0].id;

    useStore.getState().startTimer(taskId);

    const { activeTimers } = useStore.getState();
    expect(activeTimers).toHaveLength(1);
    expect(activeTimers[0].taskId).toBe(taskId);
    expect(activeTimers[0].startTime).toBeDefined();
    expect(activeTimers[0].startTime).toMatch(/^\d{4}-\d{2}-\d{2}T/);
  });

  it('複数タスクを同時に計測できる', () => {
    useStore.getState().addTask({ name: 'A', parentId: null });
    useStore.getState().addTask({ name: 'B', parentId: null });
    const taskAId = useStore.getState().tasks[0].id;
    const taskBId = useStore.getState().tasks[1].id;

    useStore.getState().startTimer(taskAId);
    useStore.getState().startTimer(taskBId);

    const { activeTimers } = useStore.getState();
    expect(activeTimers).toHaveLength(2);
    expect(activeTimers.map((t) => t.taskId)).toContain(taskAId);
    expect(activeTimers.map((t) => t.taskId)).toContain(taskBId);
  });

  it('同じタスクで再開始すると startTime が更新される', () => {
    jest.useFakeTimers();
    useStore.getState().addTask({ name: 'タスク', parentId: null });
    const taskId = useStore.getState().tasks[0].id;

    useStore.getState().startTimer(taskId);
    const firstStartTime = useStore.getState().activeTimers[0].startTime;

    jest.advanceTimersByTime(1000);
    useStore.getState().startTimer(taskId);
    const secondStartTime = useStore.getState().activeTimers[0].startTime;

    expect(useStore.getState().activeTimers).toHaveLength(1);
    expect(secondStartTime).not.toBe(firstStartTime);
    jest.useRealTimers();
  });

  it('archived タスクでは開始しない', () => {
    useStore.getState().addTask({ name: 'タスク', parentId: null });
    const taskId = useStore.getState().tasks[0].id;
    useStore.setState((state) => ({
      tasks: state.tasks.map((t) =>
        t.id === taskId ? { ...t, status: 'archived' as const } : t
      ),
    }));

    useStore.getState().startTimer(taskId);

    const { activeTimers } = useStore.getState();
    expect(activeTimers).toHaveLength(0);
  });

  it('存在しない taskId では何もしない', () => {
    useStore.getState().startTimer('non-existent-id');

    const { activeTimers } = useStore.getState();
    expect(activeTimers).toHaveLength(0);
  });
});
