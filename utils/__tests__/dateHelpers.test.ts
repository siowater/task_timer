/**
 * dateHelpers の単体テスト
 * @see T-021-2 (#79), T-021-3 (#71)
 */

import { getTodayDateString, getThisWeekDateStrings } from '../dateHelpers';

describe('getTodayDateString', () => {
  it('YYYY-MM-DD 形式を返す', () => {
    const result = getTodayDateString();
    expect(result).toMatch(/^\d{4}-\d{2}-\d{2}$/);
  });
});

describe('getThisWeekDateStrings', () => {
  it('7日分の日付を返す', () => {
    const result = getThisWeekDateStrings();
    expect(result).toHaveLength(7);
    result.forEach((d) => {
      expect(d).toMatch(/^\d{4}-\d{2}-\d{2}$/);
    });
  });

  it('重複のない日付を返す', () => {
    const result = getThisWeekDateStrings();
    expect(new Set(result).size).toBe(7);
  });
});
