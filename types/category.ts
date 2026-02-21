/**
 * カテゴリー型定義
 * タスクを分類するフォルダ。最大4階層まで。
 * @see docs/data-structure.md
 * @see docs/domain-definition.md
 */

export interface Category {
  /** 一意識別子（UUID 等） */
  id: string;
  /** 表示名（空文字・空白のみ禁止） */
  name: string;
  /** 親カテゴリーID。null の場合はルート直下 */
  parentId: string | null;
  /** 同一階層内の表示順 */
  order: number;
  /** 階層の深さ（1=最上位） */
  level: 1 | 2 | 3 | 4;
  /** 作成日時（ISO8601、任意） */
  createdAt?: string;
}
