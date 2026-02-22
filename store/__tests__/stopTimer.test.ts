/**
 * stopTimer アクションの単体テスト
 * @see T-017-2 (#69)
 * @see T-017-3 (#72) 24時間上限・Toast条件
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

describe('stopTimer', () => {
  it('計測中タスクを停止すると activeTimers から削除され SessionLog に追加される', () => {
    jest.useFakeTimers();
    useStore.getState().addTask({ name: 'タスク', parentId: null });
    const taskId = useStore.getState().tasks[0].id;

    useStore.getState().startTimer(taskId);
    expect(useStore.getState().activeTimers).toHaveLength(1);

    jest.advanceTimersByTime(30 * 60 * 1000); // 30分後
    useStore.getState().stopTimer(taskId);

    const { activeTimers, sessionLogs } = useStore.getState();
    expect(activeTimers).toHaveLength(0);
    expect(sessionLogs).toHaveLength(1);
    expect(sessionLogs[0].taskId).toBe(taskId);
    expect(sessionLogs[0].durationMinutes).toBe(30);
    jest.useRealTimers();
  });

  it('経過時間が正しく計算される', () => {
    jest.useFakeTimers();
    useStore.getState().addTask({ name: 'タスク', parentId: null });
    const taskId = useStore.getState().tasks[0].id;

    useStore.getState().startTimer(taskId);
    jest.advanceTimersByTime(90 * 60 * 1000); // 90分後
    useStore.getState().stopTimer(taskId);

    const { sessionLogs } = useStore.getState();
    expect(sessionLogs[0].durationMinutes).toBe(90);
    jest.useRealTimers();
  });

  it('24時間超えた場合は24時間に丸めて記録する', () => {
    jest.useFakeTimers();
    useStore.getState().addTask({ name: 'タスク', parentId: null });
    const taskId = useStore.getState().tasks[0].id;

    useStore.getState().startTimer(taskId);
    jest.advanceTimersByTime(25 * 60 * 60 * 1000); // 25時間後
    useStore.getState().stopTimer(taskId);

    const { sessionLogs } = useStore.getState();
    const totalMinutes = sessionLogs.reduce((s, l) => s + l.durationMinutes, 0);
    expect(totalMinutes).toBe(24 * 60); // 1440分
    jest.useRealTimers();
  });

  it('24時間超えた場合、stopTimer は capped: true を返す（Toast表示用）', () => {
    jest.useFakeTimers();
    useStore.getState().addTask({ name: 'タスク', parentId: null });
    const taskId = useStore.getState().tasks[0].id;

    useStore.getState().startTimer(taskId);
    jest.advanceTimersByTime(25 * 60 * 60 * 1000); // 25時間後
    const result = useStore.getState().stopTimer(taskId);

    expect(result.success).toBe(true);
    expect(result.capped).toBe(true);
    jest.useRealTimers();
  });

  it('24時間以内の場合、stopTimer は capped: false を返す', () => {
    jest.useFakeTimers();
    useStore.getState().addTask({ name: 'タスク', parentId: null });
    const taskId = useStore.getState().tasks[0].id;

    useStore.getState().startTimer(taskId);
    jest.advanceTimersByTime(60 * 60 * 1000); // 1時間後
    const result = useStore.getState().stopTimer(taskId);

    expect(result.success).toBe(true);
    expect(result.capped).toBe(false);
    jest.useRealTimers();
  });


  it('計測中のタスクでない場合は何もしない', () => {
    useStore.getState().addTask({ name: 'タスク', parentId: null });
    const taskId = useStore.getState().tasks[0].id;

    const result = useStore.getState().stopTimer(taskId);

    expect(result.success).toBe(false);
    expect(result.capped).toBe(false);
    const { activeTimers, sessionLogs } = useStore.getState();
    expect(activeTimers).toHaveLength(0);
    expect(sessionLogs).toHaveLength(0);
  });

  it('存在しない taskId では何もしない', () => {
    useStore.getState().addTask({ name: 'タスク', parentId: null });
    const taskId = useStore.getState().tasks[0].id;
    useStore.getState().startTimer(taskId);

    useStore.getState().stopTimer('non-existent-id');

    const { activeTimers, sessionLogs } = useStore.getState();
    expect(activeTimers).toHaveLength(1);
    expect(sessionLogs).toHaveLength(0);
  });

  it('日またぎの場合は分割して複数レコードを保存する', () => {
    useStore.getState().addTask({ name: 'タスク', parentId: null });
    const taskId = useStore.getState().tasks[0].id;

    // 23:00 UTC → 01:00 UTC (翌日) のセッションを直接セット
    const startTime = '2025-02-21T23:00:00.000Z';
    const endTime = '2025-02-22T01:00:00.000Z';
    useStore.setState({
      activeTimers: [{ taskId, startTime }],
    });

    // stopTimer は現在時刻を使うため、endTime を再現するには Date をモック
    jest.useFakeTimers();
    jest.setSystemTime(new Date(endTime));
    useStore.getState().stopTimer(taskId);
    jest.useRealTimers();

    const { activeTimers, sessionLogs } = useStore.getState();
    expect(activeTimers).toHaveLength(0);
    expect(sessionLogs).toHaveLength(2);
    expect(sessionLogs.map((l) => l.date).sort()).toEqual(['2025-02-21', '2025-02-22']);
    const totalMinutes = sessionLogs.reduce((s, l) => s + l.durationMinutes, 0);
    expect(totalMinutes).toBe(120); // 2時間
  });
});
