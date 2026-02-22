/**
 * Toast ユーティリティ
 * @see T-024-1 (#87), T-024-2 (#90)
 */

import { Toast } from 'expo-react-native-toastify';

/** エラーメッセージを Toast で表示 */
export function showErrorToast(message: string): void {
  Toast.error(message, { position: 'top' });
}

/** 情報メッセージを Toast で表示（24時間丸め等） */
export function showInfoToast(message: string): void {
  Toast.info(message, { position: 'top' });
}
