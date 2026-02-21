/**
 * Zustand Store 骨格・アクション枠
 * MMKV に永続化（categories, tasks, sessionLogs, activeTimers）
 * @see docs/data-structure.md
 * @see docs/crud-matrix.md
 */

import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import type { Category, Task, SessionLog, ActiveTimer } from '@/types';
import { zustandStorage } from '@/storage/mmkv';
import { MAX_ACTIVE_TASKS, MAX_CATEGORY_LEVEL } from '@/constants/app';
import { generateId } from '@/utils/id';

export interface AppState {
  categories: Category[];
  tasks: Task[];
  sessionLogs: SessionLog[];
  activeTimers: ActiveTimer[];
  // --- アクション（枠のみ、実装は後続タスク） ---
  addCategory: (params: { name: string; parentId: string | null; level: 1 | 2 | 3 | 4 }) => void;
  deleteCategory: (id: string) => { success: boolean; error?: string };
  reorderCategory: (id: string, newOrder: number) => void;
  addTask: (params: { name: string; parentId: string | null }) => void;
  deleteTask: (id: string) => void;
  archiveTask: (id: string) => void;
  restoreTask: (id: string) => void;
  reorderTask: (id: string, newOrder: number) => void;
  addSessionLog: (log: Omit<SessionLog, 'id' | 'createdAt'>) => void;
  updateSessionLog: (id: string, updates: Partial<SessionLog>) => void;
  deleteSessionLog: (id: string) => void;
  startTimer: (taskId: string) => void;
  stopTimer: (taskId: string) => void;
}

const PERSISTED_KEYS = ['categories', 'tasks', 'sessionLogs', 'activeTimers'] as const;

export const useStore = create<AppState>()(
  persist(
    (set) => ({
      categories: [],
      tasks: [],
      sessionLogs: [],
      activeTimers: [],
      addCategory: (params) =>
        set((state) => {
          const { name, parentId, level } = params;
          if (level === MAX_CATEGORY_LEVEL) return state;
          const trimmed = name.trim();
          if (!trimmed) return state;
          const siblings = state.categories.filter((c) => c.parentId === parentId);
          const maxOrder = siblings.length > 0 ? Math.max(...siblings.map((c) => c.order)) : -1;
          const newCategory: Category = {
            id: generateId(),
            name: trimmed,
            parentId,
            order: maxOrder + 1,
            level,
            createdAt: new Date().toISOString(),
          };
          return { categories: [...state.categories, newCategory] };
        }),
      deleteCategory: (id) => {
        const result = { success: false as boolean, error: undefined as string | undefined };
        set((state) => {
          const category = state.categories.find((c) => c.id === id);
          if (!category) {
            result.error = 'カテゴリーが見つかりません';
            return state;
          }
          const hasChildren = state.categories.some((c) => c.parentId === id);
          const hasTasks = state.tasks.some((t) => t.parentId === id);
          if (hasChildren || hasTasks) {
            result.error = '子カテゴリーまたはタスクが存在するため削除できません';
            return state;
          }
          result.success = true;
          return {
            categories: state.categories.filter((c) => c.id !== id),
          };
        });
        return result;
      },
      reorderCategory: (id, newOrder) =>
        set((state) => {
          const category = state.categories.find((c) => c.id === id);
          if (!category) return state;
          const siblings = state.categories
            .filter((c) => c.parentId === category.parentId)
            .sort((a, b) => a.order - b.order);
          const fromIndex = siblings.findIndex((c) => c.id === id);
          if (fromIndex < 0) return state;
          const toIndex = Math.max(0, Math.min(newOrder, siblings.length - 1));
          if (fromIndex === toIndex) return state;
          const reordered = [...siblings];
          const [removed] = reordered.splice(fromIndex, 1);
          reordered.splice(toIndex, 0, removed);
          const orderMap = new Map(reordered.map((c, i) => [c.id, i]));
          return {
            categories: state.categories.map((c) =>
              orderMap.has(c.id) ? { ...c, order: orderMap.get(c.id)! } : c
            ),
          };
        }),
      addTask: (params) =>
        set((state) => {
          const { name, parentId } = params;
          const trimmed = name.trim();
          if (!trimmed) return state;
          const activeCount = state.tasks.filter((t) => t.status === 'active').length;
          if (activeCount >= MAX_ACTIVE_TASKS) return state;
          const siblings = state.tasks.filter((t) => t.parentId === parentId);
          const maxOrder = siblings.length > 0 ? Math.max(...siblings.map((t) => t.order)) : -1;
          const newTask: Task = {
            id: generateId(),
            name: trimmed,
            parentId,
            order: maxOrder + 1,
            status: 'active',
            createdAt: new Date().toISOString(),
          };
          return { tasks: [...state.tasks, newTask] };
        }),
      deleteTask: (id) =>
        set((state) => ({
          tasks: state.tasks.filter((t) => t.id !== id),
          sessionLogs: state.sessionLogs.filter((log) => log.taskId !== id),
          activeTimers: state.activeTimers.filter((t) => t.taskId !== id),
        })),
      archiveTask: (id) =>
        set((state) => {
          const task = state.tasks.find((t) => t.id === id);
          if (!task) return state;
          return {
            tasks: state.tasks.map((t) =>
              t.id === id ? { ...t, status: 'archived' as const } : t
            ),
            activeTimers: state.activeTimers.filter((t) => t.taskId !== id),
          };
        }),
      restoreTask: () => {},
      reorderTask: () => {},
      addSessionLog: () => {},
      updateSessionLog: () => {},
      deleteSessionLog: () => {},
      startTimer: () => {},
      stopTimer: () => {},
    }),
    {
      name: 'task-timer-store',
      storage: createJSONStorage(() => zustandStorage),
      partialize: (state) =>
        Object.fromEntries(
          PERSISTED_KEYS.map((key) => [key, state[key]])
        ) as Pick<AppState, (typeof PERSISTED_KEYS)[number]>,
    }
  )
);
