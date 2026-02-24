/**
 * タスク型定義（カテゴリーなし・フラットリスト）
 * @see docs/web-data-structure.md
 */

export interface Task {
  /** 一意識別子 */
  id: string;
  /** 表示名 */
  name: string;
  /** 表示順（フラットリスト内） */
  order: number;
  /** アクティブ or アーカイブ（完了済み） */
  status: 'active' | 'archived';
  /** 作成日時（ISO8601） */
  createdAt?: string;
}
