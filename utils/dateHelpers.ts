/**
 * 日付ヘルパー（ローカルタイム）
 * 今日・今週のフィルタ用
 * @see T-021-2 (#79), T-021-3 (#71)
 */

/**
 * ローカル日付を YYYY-MM-DD で取得
 */
export function getTodayDateString(): string {
  const d = new Date();
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${y}-${m}-${day}`;
}

/**
 * 今週（月曜〜日曜）の日付文字列配列を取得（ISO週）
 */
export function getThisWeekDateStrings(): string[] {
  const d = new Date();
  const day = d.getDay(); // 0=Sun, 1=Mon, ...
  const mondayOffset = day === 0 ? -6 : 1 - day;
  const monday = new Date(d);
  monday.setDate(d.getDate() + mondayOffset);

  const dates: string[] = [];
  for (let i = 0; i < 7; i++) {
    const curr = new Date(monday);
    curr.setDate(monday.getDate() + i);
    const y = curr.getFullYear();
    const m = String(curr.getMonth() + 1).padStart(2, '0');
    const dayStr = String(curr.getDate()).padStart(2, '0');
    dates.push(`${y}-${m}-${dayStr}`);
  }
  return dates;
}
