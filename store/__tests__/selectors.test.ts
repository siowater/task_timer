/**
 * 子階層データ取得セレクターの単体テスト
 * @see T-011-2 (#54)
 */

import {
  getCategoriesByParentId,
  getTasksByParentId,
  getSessionLogsByDate,
} from '../selectors';
import type { Category, Task, SessionLog } from '@/types';

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

describe('getSessionLogsByDate', () => {
  const logs: SessionLog[] = [
    {
      id: '1',
      taskId: 't1',
      date: '2025-02-21',
      startTime: '09:00',
      endTime: '10:30',
      durationMinutes: 90,
      createdAt: '2025-02-21T10:30:00Z',
    },
    {
      id: '2',
      taskId: 't2',
      date: '2025-02-21',
      startTime: '09:00',
      endTime: '09:30',
      durationMinutes: 30,
      createdAt: '2025-02-21T09:30:00Z',
    },
    {
      id: '3',
      taskId: 't1',
      date: '2025-02-20',
      startTime: '14:00',
      endTime: '15:00',
      durationMinutes: 60,
      createdAt: '2025-02-20T15:00:00Z',
    },
    {
      id: '4',
      taskId: 't3',
      date: '2025-02-19',
      startTime: '10:00',
      endTime: '11:00',
      durationMinutes: 60,
      createdAt: '2025-02-19T11:00:00Z',
    },
  ];

  it('指定日付のログのみ返す', () => {
    const result = getSessionLogsByDate(logs, ['2025-02-21']);
    expect(result).toHaveLength(2);
    expect(result.every((l) => l.date === '2025-02-21')).toBe(true);
  });

  it('複数日付のログを返す', () => {
    const result = getSessionLogsByDate(logs, ['2025-02-21', '2025-02-20']);
    expect(result).toHaveLength(3);
  });

  it('日付降順でソート', () => {
    const result = getSessionLogsByDate(logs, ['2025-02-21', '2025-02-20']);
    expect(result[0].date).toBe('2025-02-21');
    expect(result[result.length - 1].date).toBe('2025-02-20');
  });

  it('該当なしの場合は空配列', () => {
    const result = getSessionLogsByDate(logs, ['2025-02-25']);
    expect(result).toHaveLength(0);
  });
});
