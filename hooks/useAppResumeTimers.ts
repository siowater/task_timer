/**
 * アプリ復帰時にアクティブタイマーを処理するフック
 * background/inactive → active に遷移したときに processResumeTimers を実行
 * @see T-019-1 (#76), T-019-2 (#78)
 * @see T-024-2 (#90) 24時間丸め時の Toast
 */

import { useEffect, useRef } from 'react';
import { AppState, type AppStateStatus } from 'react-native';
import { useStore } from '@/store/useStore';
import { showInfoToast } from '@/utils/toast';

export function useAppResumeTimers() {
  const appState = useRef<AppStateStatus>(AppState.currentState);

  useEffect(() => {
    const subscription = AppState.addEventListener('change', (nextState) => {
      const wasBackground =
        appState.current === 'background' || appState.current === 'inactive';
      appState.current = nextState;

      if (wasBackground && nextState === 'active') {
        const { cappedCount } = useStore.getState().processResumeTimers();
        if (cappedCount > 0) {
          showInfoToast('24時間を超えたため、24時間で記録しました');
        }
      }
    });

    return () => subscription.remove();
  }, []);
}
