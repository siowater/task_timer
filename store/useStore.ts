/**
 * Zustand Store 骨格
 * @see docs/data-structure.md
 */

import { create } from 'zustand';
import type { Category, Task, SessionLog, ActiveTimer } from '@/types';

export interface AppState {
  categories: Category[];
  tasks: Task[];
  sessionLogs: SessionLog[];
  activeTimers: ActiveTimer[];
}

export const useStore = create<AppState>()(() => ({
  categories: [],
  tasks: [],
  sessionLogs: [],
  activeTimers: [],
}));
