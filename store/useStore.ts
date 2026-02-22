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
import { MAX_ACTIVE_TASKS, MAX_CATEGORY_LEVEL, MAX_SESSION_HOURS } from '@/constants/app';
import { generateId } from '@/utils/id';
import {
  splitSessionByMidnight,
  splitSessionByLocalMidnight,
} from '@/utils/splitSessionByMidnight';
import { validateManualSession } from '@/utils/validateManualSession';

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
  /** 手動入力用。日またぎ分割対応。戻り値: success, error（バリデーション失敗時） */
  addSessionLog: (params: {
    taskId: string;
    date: string;
    startTime: string;
    endTime: string;
  }) => { success: boolean; error?: string };
  updateSessionLog: (id: string, updates: Partial<SessionLog>) => void;
  deleteSessionLog: (id: string) => void;
  startTimer: (taskId: string) => void;
  /** 戻り値: success=停止成功, capped=24時間超で丸めた（Toast表示用） */
  stopTimer: (taskId: string) => { success: boolean; capped: boolean };
  /** アプリ復帰時に全アクティブタイマーを処理（経過計算→ログ記録→クリア） */
  processResumeTimers: () => { processed: number; cappedCount: number };
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
      restoreTask: (id) =>
        set((state) => {
          const task = state.tasks.find((t) => t.id === id);
          if (!task || task.status !== 'archived') return state;
          const activeCount = state.tasks.filter((t) => t.status === 'active').length;
          if (activeCount >= MAX_ACTIVE_TASKS) return state;
          return {
            tasks: state.tasks.map((t) =>
              t.id === id ? { ...t, status: 'active' as const } : t
            ),
          };
        }),
      reorderTask: (id, newOrder) =>
        set((state) => {
          const task = state.tasks.find((t) => t.id === id);
          if (!task) return state;
          const siblings = state.tasks
            .filter((t) => t.parentId === task.parentId)
            .sort((a, b) => a.order - b.order);
          const fromIndex = siblings.findIndex((t) => t.id === id);
          if (fromIndex < 0) return state;
          const toIndex = Math.max(0, Math.min(newOrder, siblings.length - 1));
          if (fromIndex === toIndex) return state;
          const reordered = [...siblings];
          const [removed] = reordered.splice(fromIndex, 1);
          reordered.splice(toIndex, 0, removed);
          const orderMap = new Map(reordered.map((t, i) => [t.id, i]));
          return {
            tasks: state.tasks.map((t) =>
              orderMap.has(t.id) ? { ...t, order: orderMap.get(t.id)! } : t
            ),
          };
        }),
      addSessionLog: (params) => {
        const error = validateManualSession(params);
        if (error) return { success: false, error };

        const { taskId, date, startTime, endTime } = params;
        const startParsed = /^(\d{1,2}):(\d{2})$/.exec(startTime);
        const endParsed = /^(\d{1,2}):(\d{2})$/.exec(endTime);
        if (!startParsed || !endParsed) return { success: false, error: '時刻形式が不正です' };

        const endH = parseInt(endParsed[1], 10);
        const startH = parseInt(startParsed[1], 10);
        const endM = parseInt(endParsed[2], 10);
        const startM = parseInt(startParsed[2], 10);
        const endIsNextDay =
          endH < startH || (endH === startH && endM <= startM);
        const endDateStr = endIsNextDay
          ? (() => {
              const d = new Date(date + 'T12:00:00');
              d.setDate(d.getDate() + 1);
              return d.toISOString().slice(0, 10);
            })()
          : date;

        const startDate = new Date(`${date}T${startTime}:00`);
        const endDate = new Date(`${endDateStr}T${endTime}:00`);

        const segments = splitSessionByLocalMidnight({
          taskId,
          start: startDate,
          end: endDate,
        });

        const newLogs: SessionLog[] = segments.map((seg) => ({
          id: generateId(),
          taskId: seg.taskId,
          date: seg.date,
          startTime: seg.startTime,
          endTime: seg.endTime,
          durationMinutes: seg.durationMinutes,
          createdAt: new Date().toISOString(),
        }));

        set((state) => ({
          sessionLogs: [...state.sessionLogs, ...newLogs],
        }));
        return { success: true };
      },
      updateSessionLog: () => {},
      deleteSessionLog: () => {},
      startTimer: (taskId) =>
        set((state) => {
          const task = state.tasks.find((t) => t.id === taskId);
          if (!task || task.status !== 'active') return state;
          const startTime = new Date().toISOString();
          const existing = state.activeTimers.find((t) => t.taskId === taskId);
          const newTimers = existing
            ? state.activeTimers.map((t) =>
                t.taskId === taskId ? { taskId, startTime } : t
              )
            : [...state.activeTimers, { taskId, startTime }];
          return { activeTimers: newTimers };
        }),
      stopTimer: (taskId) => {
        const result = { success: false, capped: false };
        set((state) => {
          const timer = state.activeTimers.find((t) => t.taskId === taskId);
          if (!timer) return state;

          const start = new Date(timer.startTime);
          const end = new Date();
          let endTime = end.toISOString();

          const elapsedMs = end.getTime() - start.getTime();
          const maxMs = MAX_SESSION_HOURS * 60 * 60 * 1000;
          if (elapsedMs > maxMs) {
            result.capped = true;
            const cappedEnd = new Date(start.getTime() + maxMs);
            endTime = cappedEnd.toISOString();
          }

          const segments = splitSessionByMidnight({
            taskId,
            startTime: timer.startTime,
            endTime,
          });

          const newLogs: SessionLog[] = segments.map((seg) => ({
            id: generateId(),
            taskId: seg.taskId,
            date: seg.date,
            startTime: seg.startTime,
            endTime: seg.endTime,
            durationMinutes: seg.durationMinutes,
            createdAt: new Date().toISOString(),
          }));

          result.success = true;
          return {
            activeTimers: state.activeTimers.filter((t) => t.taskId !== taskId),
            sessionLogs: [...state.sessionLogs, ...newLogs],
          };
        });
        return result;
      },
      processResumeTimers: () => {
        const result = { processed: 0, cappedCount: 0 };
        set((state) => {
          if (state.activeTimers.length === 0) return state;

          const end = new Date();
          const maxMs = MAX_SESSION_HOURS * 60 * 60 * 1000;
          const newLogs: SessionLog[] = [];

          for (const timer of state.activeTimers) {
            const start = new Date(timer.startTime);
            let endTime = end.toISOString();

            const elapsedMs = end.getTime() - start.getTime();
            if (elapsedMs > maxMs) {
              result.cappedCount += 1;
              const cappedEnd = new Date(start.getTime() + maxMs);
              endTime = cappedEnd.toISOString();
            }

            const segments = splitSessionByMidnight({
              taskId: timer.taskId,
              startTime: timer.startTime,
              endTime,
            });

            for (const seg of segments) {
              newLogs.push({
                id: generateId(),
                taskId: seg.taskId,
                date: seg.date,
                startTime: seg.startTime,
                endTime: seg.endTime,
                durationMinutes: seg.durationMinutes,
                createdAt: new Date().toISOString(),
              });
            }
            result.processed += 1;
          }

          return {
            activeTimers: [],
            sessionLogs: [...state.sessionLogs, ...newLogs],
          };
        });
        return result;
      },
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
