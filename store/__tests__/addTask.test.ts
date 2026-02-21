/**
 * addTask アクションの単体テスト
 * @see T-012-2 (#58)
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

describe('addTask', () => {
  it('正常にタスクを追加する', () => {
    useStore.getState().addTask({
      name: '英語学習',
      parentId: null,
    });

    const { tasks } = useStore.getState();
    expect(tasks).toHaveLength(1);
    expect(tasks[0]).toMatchObject({
      name: '英語学習',
      parentId: null,
      order: 0,
      status: 'active',
    });
    expect(tasks[0].id).toBeDefined();
    expect(tasks[0].createdAt).toBeDefined();
  });

  it('複数追加時は order が連番になる', () => {
    useStore.getState().addTask({ name: 'A', parentId: null });
    useStore.getState().addTask({ name: 'B', parentId: null });
    useStore.getState().addTask({ name: 'C', parentId: null });

    const { tasks } = useStore.getState();
    expect(tasks).toHaveLength(3);
    expect(tasks.map((t) => t.order)).toEqual([0, 1, 2]);
  });

  it('アクティブタスク20個で上限に達したら追加しない', () => {
    for (let i = 0; i < MAX_ACTIVE_TASKS; i++) {
      useStore.getState().addTask({ name: `タスク${i}`, parentId: null });
    }

    const { tasks } = useStore.getState();
    expect(tasks).toHaveLength(MAX_ACTIVE_TASKS);

    useStore.getState().addTask({ name: '21個目', parentId: null });

    const { tasks: tasksAfter } = useStore.getState();
    expect(tasksAfter).toHaveLength(MAX_ACTIVE_TASKS);
  });

  it('アーカイブ済みタスクは20個上限に含めない', () => {
    for (let i = 0; i < MAX_ACTIVE_TASKS; i++) {
      useStore.getState().addTask({ name: `タスク${i}`, parentId: null });
    }
    const lastTask = useStore.getState().tasks[MAX_ACTIVE_TASKS - 1];
    useStore.setState((state) => ({
      tasks: state.tasks.map((t) =>
        t.id === lastTask.id ? { ...t, status: 'archived' as const } : t
      ),
    }));

    useStore.getState().addTask({ name: '新規タスク', parentId: null });

    const { tasks } = useStore.getState();
    const activeTasks = tasks.filter((t) => t.status === 'active');
    expect(activeTasks).toHaveLength(MAX_ACTIVE_TASKS);
    expect(tasks.some((t) => t.name === '新規タスク')).toBe(true);
  });

  it('空文字・空白のみでは追加しない', () => {
    useStore.getState().addTask({ name: '', parentId: null });
    useStore.getState().addTask({ name: '   ', parentId: null });
    useStore.getState().addTask({ name: '\t\n', parentId: null });

    const { tasks } = useStore.getState();
    expect(tasks).toHaveLength(0);
  });

  it('前後の空白はトリムされる', () => {
    useStore.getState().addTask({
      name: '  プログラミング  ',
      parentId: null,
    });

    const { tasks } = useStore.getState();
    expect(tasks).toHaveLength(1);
    expect(tasks[0].name).toBe('プログラミング');
  });
});
