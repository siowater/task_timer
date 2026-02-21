/**
 * 日またぎ分割ユーティリティ
 * 0時跨ぎでセッションを複数レコードに分割する
 * @see docs/domain-definition.md DR-03
 * @see T-018-1 (#75)
 */

export interface SessionLogSegment {
  taskId: string;
  date: string;
  startTime: string;
  endTime: string;
  durationMinutes: number;
}

function toDateStringUTC(d: Date): string {
  const y = d.getUTCFullYear();
  const m = String(d.getUTCMonth() + 1).padStart(2, '0');
  const day = String(d.getUTCDate()).padStart(2, '0');
  return `${y}-${m}-${day}`;
}

function toTimeStringUTC(d: Date): string {
  const h = String(d.getUTCHours()).padStart(2, '0');
  const m = String(d.getUTCMinutes()).padStart(2, '0');
  return `${h}:${m}`;
}

function diffMinutes(start: Date, end: Date): number {
  return Math.round((end.getTime() - start.getTime()) / 60000);
}

/**
 * セッションを日付（UTC）で分割する。0時跨ぎの場合は複数レコードに分割。
 * startTime/endTime は ISO8601（UTC）を想定。
 */
export function splitSessionByMidnight(params: {
  taskId: string;
  startTime: string;
  endTime: string;
}): SessionLogSegment[] {
  const { taskId, startTime, endTime } = params;
  const start = new Date(startTime);
  const end = new Date(endTime);

  const startDateStr = toDateStringUTC(start);
  const endDateStr = toDateStringUTC(end);

  if (startDateStr === endDateStr) {
    const durationMinutes = diffMinutes(start, end);
    return [
      {
        taskId,
        date: startDateStr,
        startTime: toTimeStringUTC(start),
        endTime: toTimeStringUTC(end),
        durationMinutes,
      },
    ];
  }

  const segments: SessionLogSegment[] = [];
  let current = new Date(Date.UTC(
    start.getUTCFullYear(),
    start.getUTCMonth(),
    start.getUTCDate()
  ));

  while (toDateStringUTC(current) <= endDateStr) {
    const dateStr = toDateStringUTC(current);
    const dayStart = new Date(current);
    const dayEnd = new Date(current);
    dayEnd.setUTCHours(23, 59, 59, 999);

    const segmentStart = start > dayStart ? start : dayStart;
    const segmentEnd = end < dayEnd ? end : dayEnd;

    if (segmentStart < segmentEnd) {
      const durationMinutes = diffMinutes(segmentStart, segmentEnd);
      segments.push({
        taskId,
        date: dateStr,
        startTime: toTimeStringUTC(segmentStart),
        endTime: toTimeStringUTC(segmentEnd),
        durationMinutes,
      });
    }

    current.setUTCDate(current.getUTCDate() + 1);
  }

  return segments;
}
