/**
 * アクティブタイマー型定義
 * 計測中のタスクの状態。アプリ復帰時の経過時間計算に使用。
 * @see docs/data-structure.md
 * @see docs/domain-definition.md
 */

export interface ActiveTimer {
  /** 計測中のタスクID */
  taskId: string;
  /** 開始日時（ISO8601、アプリ復帰時の計算用） */
  startTime: string;
}
