/**
 * deleteTask アクションの単体テスト
 * @see T-013-2 (#64)
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

describe('deleteTask', () => {
  it('タスクを削除できる', () => {
    useStore.getState().addTask({ name: '削除対象', parentId: null });
    const { tasks } = useStore.getState();
    const taskId = tasks[0].id;

    useStore.getState().deleteTask(taskId);

    const { tasks: after } = useStore.getState();
    expect(after).toHaveLength(0);
  });

  it('紐づく SessionLog も削除する', () => {
    useStore.getState().addTask({ name: 'タスク', parentId: null });
    const taskId = useStore.getState().tasks[0].id;
    useStore.setState((state) => ({
      sessionLogs: [
        ...state.sessionLogs,
        {
          id: 'log-1',
          taskId,
          date: '2026-02-21',
          startTime: '09:00',
          endTime: '10:00',
          durationMinutes: 60,
        },
        {
          id: 'log-2',
          taskId,
          date: '2026-02-21',
          startTime: '11:00',
          endTime: '12:00',
          durationMinutes: 60,
        },
      ],
    }));

    useStore.getState().deleteTask(taskId);

    const { tasks, sessionLogs } = useStore.getState();
    expect(tasks).toHaveLength(0);
    expect(sessionLogs).toHaveLength(0);
  });

  it('他タスクの SessionLog は残る', () => {
    useStore.getState().addTask({ name: 'タスクA', parentId: null });
    useStore.getState().addTask({ name: 'タスクB', parentId: null });
    const taskAId = useStore.getState().tasks[0].id;
    const taskBId = useStore.getState().tasks[1].id;
    useStore.setState((state) => ({
      sessionLogs: [
        {
          id: 'log-a',
          taskId: taskAId,
          date: '2026-02-21',
          startTime: '09:00',
          endTime: '10:00',
          durationMinutes: 60,
        },
        {
          id: 'log-b',
          taskId: taskBId,
          date: '2026-02-21',
          startTime: '11:00',
          endTime: '12:00',
          durationMinutes: 60,
        },
      ],
    }));

    useStore.getState().deleteTask(taskAId);

    const { tasks, sessionLogs } = useStore.getState();
    expect(tasks).toHaveLength(1);
    expect(tasks[0].name).toBe('タスクB');
    expect(sessionLogs).toHaveLength(1);
    expect(sessionLogs[0].taskId).toBe(taskBId);
  });

  it('計測中のタスク削除時は ActiveTimer も削除する', () => {
    useStore.getState().addTask({ name: '計測中タスク', parentId: null });
    const taskId = useStore.getState().tasks[0].id;
    useStore.setState((state) => ({
      activeTimers: [
        ...state.activeTimers,
        { taskId, startTime: new Date().toISOString() },
      ],
    }));

    useStore.getState().deleteTask(taskId);

    const { tasks, activeTimers } = useStore.getState();
    expect(tasks).toHaveLength(0);
    expect(activeTimers).toHaveLength(0);
  });

  it('存在しないIDでもエラーにならない', () => {
    expect(() => {
      useStore.getState().deleteTask('non-existent-id');
    }).not.toThrow();

    const { tasks } = useStore.getState();
    expect(tasks).toHaveLength(0);
  });
});
