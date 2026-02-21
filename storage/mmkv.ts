/**
 * MMKV ストレージの初期化
 * Zustand persist で Store を永続化する際に使用する。
 * @see docs/data-structure.md
 * @see docs/requirements.md
 */

import type { StateStorage } from 'zustand/middleware';
import { createMMKV } from 'react-native-mmkv';

/** アプリ用 MMKV ストレージインスタンス（Store 永続化用） */
export const storage = createMMKV({
  id: 'task-timer-store',
});

/** Zustand persist 用 StateStorage アダプター */
export const zustandStorage: StateStorage = {
  setItem: (name, value) => {
    storage.set(name, value);
  },
  getItem: (name) => {
    const value = storage.getString(name);
    return value ?? null;
  },
  removeItem: (name) => {
    storage.remove(name);
  },
};
