/**
 * updateSessionLog, deleteSessionLog の単体テスト
 * @see T-023-1 (#89), T-023-2 (#81)
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

describe('updateSessionLog', () => {
  it('既存ログを更新する', () => {
    useStore.getState().addTask({ name: 'タスク', parentId: null });
    const taskId = useStore.getState().tasks[0].id;
    useStore.getState().addSessionLog({
      taskId,
      date: '2025-02-21',
      startTime: '09:00',
      endTime: '10:00',
    });
    const logId = useStore.getState().sessionLogs[0].id;

    const result = useStore.getState().updateSessionLog(logId, {
      startTime: '09:30',
      endTime: '10:30',
    });

    expect(result.success).toBe(true);
    const log = useStore.getState().sessionLogs.find((l) => l.id === logId);
    expect(log?.startTime).toBe('09:30');
    expect(log?.endTime).toBe('10:30');
    expect(log?.durationMinutes).toBe(60);
  });

  it('存在しないIDでは何もしない', () => {
    const result = useStore.getState().updateSessionLog('non-existent', {
      durationMinutes: 30,
    });
    expect(result.success).toBe(false);
  });

  it('バリデーション失敗時は success: false', () => {
    useStore.getState().addTask({ name: 'タスク', parentId: null });
    const taskId = useStore.getState().tasks[0].id;
    useStore.getState().addSessionLog({
      taskId,
      date: '2025-02-21',
      startTime: '09:00',
      endTime: '10:00',
    });
    const logId = useStore.getState().sessionLogs[0].id;

    const result = useStore.getState().updateSessionLog(logId, {
      startTime: '25:00',
      endTime: '10:00',
    });

    expect(result.success).toBe(false);
    expect(result.error).toBeDefined();
  });
});

describe('deleteSessionLog', () => {
  it('既存ログを削除する', () => {
    useStore.getState().addTask({ name: 'タスク', parentId: null });
    const taskId = useStore.getState().tasks[0].id;
    useStore.getState().addSessionLog({
      taskId,
      date: '2025-02-21',
      startTime: '09:00',
      endTime: '10:00',
    });
    const logId = useStore.getState().sessionLogs[0].id;

    useStore.getState().deleteSessionLog(logId);

    expect(useStore.getState().sessionLogs).toHaveLength(0);
  });
});
