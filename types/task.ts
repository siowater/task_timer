/**
 * タスク型定義
 * 時間計測の対象。ルートまたは Level 1〜4 のカテゴリー直下に配置可能。
 * @see docs/data-structure.md
 * @see docs/domain-definition.md
 */

export interface Task {
  /** 一意識別子 */
  id: string;
  /** 表示名 */
  name: string;
  /** 親カテゴリーID。null の場合はルート直下 */
  parentId: string | null;
  /** 同一階層内の表示順 */
  order: number;
  /** アクティブ or アーカイブ（完了済み） */
  status: 'active' | 'archived';
  /** 作成日時（ISO8601、任意） */
  createdAt?: string;
}
