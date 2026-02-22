/**
 * 手動入力セッションのバリデーション
 * @see T-022-3 (#86)
 * @see docs/domain-definition.md
 */

import { MAX_SESSION_HOURS } from '@/constants/app';

export interface ManualSessionInput {
  taskId: string;
  date: string;
  startTime: string;
  endTime: string;
}

const DATE_REGEX = /^\d{4}-\d{2}-\d{2}$/;
const TIME_REGEX = /^\d{1,2}:\d{2}$/;

function parseTime(s: string): { h: number; m: number } | null {
  const match = s.match(/^(\d{1,2}):(\d{2})$/);
  if (!match) return null;
  const h = parseInt(match[1], 10);
  const m = parseInt(match[2], 10);
  if (h < 0 || h > 23 || m < 0 || m > 59) return null;
  return { h, m };
}

function addDay(dateStr: string): string {
  const d = new Date(dateStr + 'T12:00:00');
  d.setDate(d.getDate() + 1);
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${y}-${m}-${day}`;
}

/**
 * 手動入力のバリデーション。成功時は undefined、失敗時はエラーメッセージを返す。
 */
export function validateManualSession(input: ManualSessionInput): string | undefined {
  const { taskId, date, startTime, endTime } = input;

  if (!taskId?.trim()) return 'タスクを選択してください';
  if (!date?.trim()) return '日付を入力してください';
  if (!startTime?.trim()) return '開始時刻を入力してください';
  if (!endTime?.trim()) return '終了時刻を入力してください';

  if (!DATE_REGEX.test(date)) return '日付は YYYY-MM-DD 形式で入力してください';
  if (!TIME_REGEX.test(startTime)) return '開始時刻は HH:mm 形式で入力してください';
  if (!TIME_REGEX.test(endTime)) return '終了時刻は HH:mm 形式で入力してください';

  const startParsed = parseTime(startTime);
  const endParsed = parseTime(endTime);
  if (!startParsed || !endParsed) return '時刻の形式が不正です';

  const today = new Date().toISOString().slice(0, 10);
  if (date > today) return '未来の日付は入力できません';

  const endDateStr = endParsed.h < startParsed.h || (endParsed.h === startParsed.h && endParsed.m <= startParsed.m)
    ? addDay(date)
    : date;

  const startDate = new Date(`${date}T${startTime}:00`);
  const endDate = new Date(`${endDateStr}T${endTime}:00`);

  if (startDate >= endDate) return '終了時刻は開始時刻より後にしてください';

  const durationMs = endDate.getTime() - startDate.getTime();
  const durationHours = durationMs / (60 * 60 * 1000);
  if (durationHours > MAX_SESSION_HOURS) return `1回の計測は${MAX_SESSION_HOURS}時間以内にしてください`;

  return undefined;
}
