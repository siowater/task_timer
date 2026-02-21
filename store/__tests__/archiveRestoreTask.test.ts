/**
 * archiveTask / restoreTask アクションの単体テスト
 * @see T-014-3 (#62)
 */

jest.mock('@/storage/mmkv');

import { useStore } from '../useStore';
import { MAX_ACTIVE_TASKS } from '@/constants/app';

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

describe('restoreTask', () => {
  it('archived タスクを active に復元する', () => {
    useStore.getState().addTask({ name: '復元対象', parentId: null });
    const taskId = useStore.getState().tasks[0].id;
    useStore.setState((state) => ({
      tasks: state.tasks.map((t) =>
        t.id === taskId ? { ...t, status: 'archived' as const } : t
      ),
    }));

    useStore.getState().restoreTask(taskId);

    const { tasks } = useStore.getState();
    expect(tasks[0].status).toBe('active');
  });

  it('アクティブタスク20個の場合は復元しない', () => {
    for (let i = 0; i < MAX_ACTIVE_TASKS; i++) {
      useStore.getState().addTask({ name: `タスク${i}`, parentId: null });
    }
    const lastTask = useStore.getState().tasks[MAX_ACTIVE_TASKS - 1];
    useStore.setState((state) => ({
      tasks: state.tasks.map((t) =>
        t.id === lastTask.id ? { ...t, status: 'archived' as const } : t
      ),
    }));
    useStore.setState((state) => ({
      tasks: [
        ...state.tasks,
        {
          id: 'extra-active',
          name: '追加アクティブ',
          parentId: null,
          order: MAX_ACTIVE_TASKS,
          status: 'active' as const,
        },
      ],
    }));
    const archivedTaskId = lastTask.id;
    expect(useStore.getState().tasks.filter((t) => t.status === 'active')).toHaveLength(
      MAX_ACTIVE_TASKS
    );

    useStore.getState().restoreTask(archivedTaskId);

    const { tasks } = useStore.getState();
    const task = tasks.find((t) => t.id === archivedTaskId);
    expect(task?.status).toBe('archived');
  });

  it('存在しないIDでもエラーにならない', () => {
    expect(() => {
      useStore.getState().restoreTask('non-existent-id');
    }).not.toThrow();
  });
});
