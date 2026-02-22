/**
 * 経過時間のリアルタイム表示用フック
 * startTime から現在までの経過秒数を1秒ごとに更新
 * @see T-020-2 (#74)
 */

import { useEffect, useState } from 'react';

export function useElapsedTime(startTime: string | null): number {
  const [elapsedSeconds, setElapsedSeconds] = useState(0);

  useEffect(() => {
    if (!startTime) {
      setElapsedSeconds(0);
      return;
    }

    const update = () => {
      const start = new Date(startTime).getTime();
      const now = Date.now();
      setElapsedSeconds(Math.floor((now - start) / 1000));
    };

    update();
    const id = setInterval(update, 1000);
    return () => clearInterval(id);
  }, [startTime]);

  return elapsedSeconds;
}
