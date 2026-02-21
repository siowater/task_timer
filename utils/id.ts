/**
 * ID 生成ユーティリティ
 * @see docs/data-structure.md
 */

/**
 * UUID v4 形式の一意IDを生成する。
 * crypto.randomUUID が利用可能な場合はそれを使用し、
 * そうでない場合はフォールバック実装を使用する。
 */
export function generateId(): string {
  if (typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function') {
    return crypto.randomUUID();
  }
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
    const r = (Math.random() * 16) | 0;
    const v = c === 'x' ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
}
