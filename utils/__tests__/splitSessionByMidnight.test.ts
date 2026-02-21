/**
 * splitSessionByMidnight ユーティリティの単体テスト
 * @see T-018-2 (#68)
 */

import { splitSessionByMidnight } from '../splitSessionByMidnight';

describe('splitSessionByMidnight', () => {
  it('同日の場合は1レコードを返す', () => {
    const result = splitSessionByMidnight({
      taskId: 'task-1',
      startTime: '2026-02-21T09:00:00.000Z',
      endTime: '2026-02-21T12:00:00.000Z',
    });

    expect(result).toHaveLength(1);
    expect(result[0]).toMatchObject({
      taskId: 'task-1',
      date: '2026-02-21',
      durationMinutes: 180,
    });
    expect(result[0].startTime).toBeDefined();
    expect(result[0].endTime).toBeDefined();
  });

  it('0時跨ぎの場合は2レコードに分割する', () => {
    const result = splitSessionByMidnight({
      taskId: 'task-1',
      startTime: '2026-02-21T22:00:00.000Z',
      endTime: '2026-02-22T02:00:00.000Z',
    });

    expect(result).toHaveLength(2);
    expect(result[0].date).toBe('2026-02-21');
    expect(result[1].date).toBe('2026-02-22');
    expect(result[0].durationMinutes + result[1].durationMinutes).toBe(240);
  });

  it('日本時間で0時跨ぎ（UTC 15:00-翌3:00）', () => {
    const result = splitSessionByMidnight({
      taskId: 'task-1',
      startTime: '2026-02-21T15:00:00.000Z',
      endTime: '2026-02-22T03:00:00.000Z',
    });

    expect(result).toHaveLength(2);
    expect(result[0].date).toBe('2026-02-21');
    expect(result[1].date).toBe('2026-02-22');
  });

  it('3日跨ぎの場合は3レコードに分割する', () => {
    const result = splitSessionByMidnight({
      taskId: 'task-1',
      startTime: '2026-02-21T23:00:00.000Z',
      endTime: '2026-02-23T01:00:00.000Z',
    });

    expect(result).toHaveLength(3);
    expect(result[0].date).toBe('2026-02-21');
    expect(result[1].date).toBe('2026-02-22');
    expect(result[2].date).toBe('2026-02-23');
  });

  it('各レコードの durationMinutes の合計が全体の分数と一致する', () => {
    const result = splitSessionByMidnight({
      taskId: 'task-1',
      startTime: '2026-02-21T21:00:00.000Z',
      endTime: '2026-02-22T03:00:00.000Z',
    });

    const total = result.reduce((sum, r) => sum + r.durationMinutes, 0);
    expect(total).toBe(360);
  });
});
