/**
 * 経過時間のフォーマットユーティリティ
 * @see T-020-2 (#74)
 */

import { MAX_SESSION_HOURS } from '@/constants/app';

const MAX_SECONDS = MAX_SESSION_HOURS * 60 * 60;

/**
 * 秒数を "H:MM:SS" 形式でフォーマット（24時間上限）
 */
export function formatElapsedSeconds(totalSeconds: number): string {
  const capped = Math.min(Math.max(0, Math.floor(totalSeconds)), MAX_SECONDS);
  const h = Math.floor(capped / 3600);
  const m = Math.floor((capped % 3600) / 60);
  const s = capped % 60;

  if (h > 0) {
    return `${h}:${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
  }
  return `${m}:${String(s).padStart(2, '0')}`;
}
