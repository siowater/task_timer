/**
 * Store セレクター
 * parentId で子カテゴリー・タスクを取得
 * @see T-011-2 (#54)
 */

import type { Category, Task } from '@/types';

function sortByOrder<T extends { order: number }>(items: T[]): T[] {
  return [...items].sort((a, b) => a.order - b.order);
}

/**
 * 指定 parentId 直下の子カテゴリーを order 順で取得
 */
export function getCategoriesByParentId(
  categories: Category[],
  parentId: string | null
): Category[] {
  return sortByOrder(categories.filter((c) => c.parentId === parentId));
}

/**
 * 指定 parentId 直下のタスクを order 順で取得
 */
export function getTasksByParentId(tasks: Task[], parentId: string | null): Task[] {
  return sortByOrder(tasks.filter((t) => t.parentId === parentId));
}
