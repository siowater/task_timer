/**
 * 子階層データ取得セレクターの単体テスト
 * @see T-011-2 (#54)
 */

import { getCategoriesByParentId, getTasksByParentId } from '../selectors';
import type { Category, Task } from '@/types';

describe('getCategoriesByParentId', () => {
  const categories: Category[] = [
    { id: 'c1', name: 'A', parentId: null, order: 0, level: 1, createdAt: '' },
    { id: 'c2', name: 'B', parentId: null, order: 1, level: 1, createdAt: '' },
    { id: 'c3', name: 'A-1', parentId: 'c1', order: 0, level: 2, createdAt: '' },
    { id: 'c4', name: 'A-2', parentId: 'c1', order: 1, level: 2, createdAt: '' },
    { id: 'c5', name: 'B-1', parentId: 'c2', order: 0, level: 2, createdAt: '' },
  ];

  it('parentId=null でルート直下のカテゴリーを取得', () => {
    const result = getCategoriesByParentId(categories, null);
    expect(result).toHaveLength(2);
    expect(result.map((c) => c.id)).toEqual(['c1', 'c2']);
    expect(result.map((c) => c.name)).toEqual(['A', 'B']);
  });

  it('parentId 指定で子カテゴリーを取得', () => {
    const result = getCategoriesByParentId(categories, 'c1');
    expect(result).toHaveLength(2);
    expect(result.map((c) => c.id)).toEqual(['c3', 'c4']);
    expect(result.map((c) => c.name)).toEqual(['A-1', 'A-2']);
  });

  it('子が1件の場合はその1件を返す', () => {
    const result = getCategoriesByParentId(categories, 'c2');
    expect(result).toHaveLength(1);
    expect(result[0].name).toBe('B-1');
  });

  it('存在しない parentId の場合は空配列', () => {
    const result = getCategoriesByParentId(categories, 'nonexistent');
    expect(result).toHaveLength(0);
  });

  it('order 順でソートされて返る', () => {
    const unsorted: Category[] = [
      { id: 'x', name: 'Z', parentId: null, order: 2, level: 1, createdAt: '' },
      { id: 'y', name: 'Y', parentId: null, order: 0, level: 1, createdAt: '' },
      { id: 'z', name: 'X', parentId: null, order: 1, level: 1, createdAt: '' },
    ];
    const result = getCategoriesByParentId(unsorted, null);
    expect(result.map((c) => c.order)).toEqual([0, 1, 2]);
    expect(result.map((c) => c.name)).toEqual(['Y', 'X', 'Z']);
  });
});

describe('getTasksByParentId', () => {
  const tasks: Task[] = [
    { id: 't1', name: 'Task1', parentId: null, order: 0, status: 'active', createdAt: '' },
    { id: 't2', name: 'Task2', parentId: null, order: 1, status: 'active', createdAt: '' },
    { id: 't3', name: 'Sub1', parentId: 'c1', order: 0, status: 'active', createdAt: '' },
    { id: 't4', name: 'Sub2', parentId: 'c1', order: 1, status: 'archived', createdAt: '' },
  ];

  it('parentId=null でルート直下のタスクを取得', () => {
    const result = getTasksByParentId(tasks, null);
    expect(result).toHaveLength(2);
    expect(result.map((t) => t.id)).toEqual(['t1', 't2']);
  });

  it('parentId 指定で子タスクを取得', () => {
    const result = getTasksByParentId(tasks, 'c1');
    expect(result).toHaveLength(2);
    expect(result.map((t) => t.id)).toEqual(['t3', 't4']);
  });

  it('存在しない parentId の場合は空配列', () => {
    const result = getTasksByParentId(tasks, 'nonexistent');
    expect(result).toHaveLength(0);
  });

  it('order 順でソートされて返る', () => {
    const unsorted: Task[] = [
      { id: 'a', name: 'A', parentId: null, order: 2, status: 'active', createdAt: '' },
      { id: 'b', name: 'B', parentId: null, order: 0, status: 'active', createdAt: '' },
      { id: 'c', name: 'C', parentId: null, order: 1, status: 'active', createdAt: '' },
    ];
    const result = getTasksByParentId(unsorted, null);
    expect(result.map((t) => t.order)).toEqual([0, 1, 2]);
    expect(result.map((t) => t.name)).toEqual(['B', 'C', 'A']);
  });
});
