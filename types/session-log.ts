/**
 * セッションログ型定義
 * 「いつ・どのタスクを・何分行ったか」の記録。1レコード = 1日分の稼働。
 * @see docs/data-structure.md
 * @see docs/domain-definition.md
 */

export interface SessionLog {
  /** 一意識別子 */
  id: string;
  /** 紐づくタスクID */
  taskId: string;
  /** 日付（YYYY-MM-DD） */
  date: string;
  /** 開始時刻（HH:mm または ISO8601） */
  startTime: string;
  /** 終了時刻 */
  endTime: string;
  /** 分数（正の整数） */
  durationMinutes: number;
  /** 作成日時（ISO8601、任意） */
  createdAt?: string;
}
