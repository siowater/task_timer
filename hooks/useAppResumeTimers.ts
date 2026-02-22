/**
 * アプリ復帰時にアクティブタイマーを処理するフック
 * background/inactive → active に遷移したときに processResumeTimers を実行
 * @see T-019-1 (#76), T-019-2 (#78)
 */

import { useEffect, useRef } from 'react';
import { AppState, type AppStateStatus } from 'react-native';
import { useStore } from '@/store/useStore';

export function useAppResumeTimers() {
  const appState = useRef<AppStateStatus>(AppState.currentState);

  useEffect(() => {
    const subscription = AppState.addEventListener('change', (nextState) => {
      const wasBackground =
        appState.current === 'background' || appState.current === 'inactive';
      appState.current = nextState;

      if (wasBackground && nextState === 'active') {
        useStore.getState().processResumeTimers();
      }
    });

    return () => subscription.remove();
  }, []);
}
