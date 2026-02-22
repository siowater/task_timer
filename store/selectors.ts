/**
 * Store セレクター
 * parentId で子カテゴリー・タスクを取得
 * @see T-011-2 (#54)
 * @see T-021-2 (#79), T-021-3 (#71)
 */

import type { Category, Task, SessionLog } from '@/types';

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

/**
 * 指定日付のセッションログを取得（日付降順・createdAt降順）
 */
export function getSessionLogsByDate(
  sessionLogs: SessionLog[],
  dateStrings: string[]
): SessionLog[] {
  const set = new Set(dateStrings);
  return sessionLogs
    .filter((log) => set.has(log.date))
    .sort((a, b) => {
      if (a.date !== b.date) return b.date.localeCompare(a.date);
      return (b.createdAt ?? '').localeCompare(a.createdAt ?? '');
    });
}
