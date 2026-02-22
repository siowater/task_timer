/**
 * validateManualSession の単体テスト
 * @see T-022-3 (#86)
 */

import { validateManualSession } from '../validateManualSession';

describe('validateManualSession', () => {
  const validInput = {
    taskId: 't1',
    date: '2025-02-21',
    startTime: '09:00',
    endTime: '10:30',
  };

  it('有効な入力は undefined を返す', () => {
    expect(validateManualSession(validInput)).toBeUndefined();
  });

  it('taskId が空ならエラー', () => {
    expect(validateManualSession({ ...validInput, taskId: '' })).toBeDefined();
  });

  it('日付が空ならエラー', () => {
    expect(validateManualSession({ ...validInput, date: '' })).toBeDefined();
  });

  it('日付形式が不正ならエラー', () => {
    expect(validateManualSession({ ...validInput, date: '2025/02/21' })).toBeDefined();
  });

  it('時刻形式が不正ならエラー', () => {
    expect(validateManualSession({ ...validInput, startTime: '9:00' })).toBeUndefined();
    expect(validateManualSession({ ...validInput, startTime: '25:00' })).toBeDefined();
  });

  it('10:00→09:00 は翌日扱いで23時間として有効', () => {
    const result = validateManualSession({
      ...validInput,
      startTime: '10:00',
      endTime: '09:00',
    });
    expect(result).toBeUndefined();
  });

  it('日またぎ（23:00→01:00）は有効', () => {
    const result = validateManualSession({
      ...validInput,
      date: '2025-02-21',
      startTime: '23:00',
      endTime: '01:00',
    });
    expect(result).toBeUndefined();
  });

  it('24時間ちょうどは有効', () => {
    // 23:00→23:00 翌日 = 24h（境界値）
    const result = validateManualSession({
      ...validInput,
      startTime: '23:00',
      endTime: '23:00',
    });
    expect(result).toBeUndefined();
  });
});
