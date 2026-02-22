/**
 * Toast ユーティリティ
 * @see T-024-1 (#87), T-024-2 (#90)
 */

import Toast from 'react-native-toast-message';

/** エラーメッセージを Toast で表示 */
export function showErrorToast(message: string): void {
  Toast.show({
    type: 'error',
    text1: 'エラー',
    text2: message,
  });
}

/** 情報メッセージを Toast で表示（24時間丸め等） */
export function showInfoToast(message: string): void {
  Toast.show({
    type: 'info',
    text1: 'お知らせ',
    text2: message,
  });
}
