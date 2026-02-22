/**
 * processResumeTimers アクションの単体テスト
 * @see T-019-1 (#76), T-019-2 (#78)
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

describe('processResumeTimers', () => {
  it('アクティブタイマーがなければ何もしない', () => {
    const result = useStore.getState().processResumeTimers();

    expect(result.processed).toBe(0);
    expect(result.cappedCount).toBe(0);
    expect(useStore.getState().activeTimers).toHaveLength(0);
    expect(useStore.getState().sessionLogs).toHaveLength(0);
  });

  it('復帰時に全アクティブタイマーを処理し SessionLog に保存する', () => {
    jest.useFakeTimers();
    useStore.getState().addTask({ name: 'A', parentId: null });
    useStore.getState().addTask({ name: 'B', parentId: null });
    const taskAId = useStore.getState().tasks[0].id;
    const taskBId = useStore.getState().tasks[1].id;

    useStore.getState().startTimer(taskAId);
    useStore.getState().startTimer(taskBId);
    jest.advanceTimersByTime(30 * 60 * 1000); // 30分後

    const result = useStore.getState().processResumeTimers();

    expect(result.processed).toBe(2);
    expect(result.cappedCount).toBe(0);
    const { activeTimers, sessionLogs } = useStore.getState();
    expect(activeTimers).toHaveLength(0);
    expect(sessionLogs).toHaveLength(2);
    expect(sessionLogs.map((l) => l.taskId).sort()).toEqual(
      [taskAId, taskBId].sort()
    );
    expect(sessionLogs.every((l) => l.durationMinutes === 30)).toBe(true);
    jest.useRealTimers();
  });

  it('24時間超えのタイマーは丸めて記録し cappedCount を返す', () => {
    jest.useFakeTimers();
    useStore.getState().addTask({ name: 'タスク', parentId: null });
    const taskId = useStore.getState().tasks[0].id;

    useStore.getState().startTimer(taskId);
    jest.advanceTimersByTime(25 * 60 * 60 * 1000); // 25時間後

    const result = useStore.getState().processResumeTimers();

    expect(result.processed).toBe(1);
    expect(result.cappedCount).toBe(1);
    const { sessionLogs } = useStore.getState();
    const totalMinutes = sessionLogs.reduce((s, l) => s + l.durationMinutes, 0);
    expect(totalMinutes).toBe(24 * 60);
    jest.useRealTimers();
  });
});
