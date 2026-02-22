/**
 * formatElapsedSeconds の単体テスト
 * @see T-020-2 (#74)
 */

import { formatElapsedSeconds } from '../formatElapsed';

describe('formatElapsedSeconds', () => {
  it('0秒は 0:00', () => {
    expect(formatElapsedSeconds(0)).toBe('0:00');
  });

  it('59秒は 0:59', () => {
    expect(formatElapsedSeconds(59)).toBe('0:59');
  });

  it('60秒は 1:00', () => {
    expect(formatElapsedSeconds(60)).toBe('1:00');
  });

  it('90分は 1:30:00', () => {
    expect(formatElapsedSeconds(90 * 60)).toBe('1:30:00');
  });

  it('1時間は 1:00:00', () => {
    expect(formatElapsedSeconds(3600)).toBe('1:00:00');
  });

  it('24時間は 24:00:00', () => {
    expect(formatElapsedSeconds(24 * 3600)).toBe('24:00:00');
  });

  it('24時間超は24時間にキャップ', () => {
    expect(formatElapsedSeconds(25 * 3600)).toBe('24:00:00');
  });

  it('負の値は0として扱う', () => {
    expect(formatElapsedSeconds(-100)).toBe('0:00');
  });
});
