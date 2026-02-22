/**
 * addSessionLog アクションの単体テスト
 * @see T-022-2 (#83)
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

describe('addSessionLog', () => {
  it('有効な入力で SessionLog を追加する', () => {
    useStore.getState().addTask({ name: 'タスク', parentId: null });
    const taskId = useStore.getState().tasks[0].id;

    const result = useStore.getState().addSessionLog({
      taskId,
      date: '2025-02-21',
      startTime: '09:00',
      endTime: '10:30',
    });

    expect(result.success).toBe(true);
    const { sessionLogs } = useStore.getState();
    expect(sessionLogs).toHaveLength(1);
    expect(sessionLogs[0].taskId).toBe(taskId);
    expect(sessionLogs[0].date).toBe('2025-02-21');
    expect(sessionLogs[0].durationMinutes).toBe(90);
  });

  it('バリデーション失敗時は success: false と error を返す', () => {
    const result = useStore.getState().addSessionLog({
      taskId: '',
      date: '2025-02-21',
      startTime: '09:00',
      endTime: '10:00',
    });

    expect(result.success).toBe(false);
    expect(result.error).toBeDefined();
    expect(useStore.getState().sessionLogs).toHaveLength(0);
  });

  it('日またぎの場合は分割して複数レコードを追加する', () => {
    useStore.getState().addTask({ name: 'タスク', parentId: null });
    const taskId = useStore.getState().tasks[0].id;

    const result = useStore.getState().addSessionLog({
      taskId,
      date: '2025-02-21',
      startTime: '23:00',
      endTime: '01:00',
    });

    expect(result.success).toBe(true);
    const { sessionLogs } = useStore.getState();
    expect(sessionLogs.length).toBeGreaterThanOrEqual(2);
    const totalMinutes = sessionLogs.reduce((s, l) => s + l.durationMinutes, 0);
    expect(totalMinutes).toBe(120);
  });
});
