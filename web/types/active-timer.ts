/**
 * アクティブタイマー型定義
 * 計測中のタスクの状態（クライアント側 or DB）
 * @see docs/web-data-structure.md
 */

export interface ActiveTimer {
  /** 計測中のタスクID */
  taskId: string;
  /** 開始日時（ISO8601） */
  startTime: string;
}
