# CRUD マトリクス (CRUD Matrix)

## 概要
データエンティティに対する操作（Create / Read / Update / Delete）と、それを実行する機能の対応表。
参照: [feature-list.md](./feature-list.md), [domain-definition.md](./domain-definition.md)

---

## 1. Category（カテゴリー）

| 操作 | 機能ID | 説明 |
|------|--------|------|
| **Create** | F-002 | 新規カテゴリー作成（Level 4 では不可） |
| **Read** | F-001, F-004 | 一覧表示、ドリルダウン時の子カテゴリー取得 |
| **Update** | F-005 | 並び替え（order の更新） |
| **Delete** | F-003 | 削除（空の場合のみ。F-028 でチェック） |

---

## 2. Task（タスク）

| 操作 | 機能ID | 説明 |
|------|--------|------|
| **Create** | F-007 | 新規タスク作成（F-027 で20個上限チェック） |
| **Read** | F-006, F-012 | 一覧表示（アクティブ＋アーカイブ） |
| **Update** | F-009, F-010, F-011 | アーカイブ、復元、並び替え |
| **Delete** | F-008 | 削除（紐づく SessionLog も物理削除） |

---

## 3. SessionLog（セッションログ）

| 操作 | 機能ID | 説明 |
|------|--------|------|
| **Create** | F-018, F-022 | タイマー停止時の自動記録、手動時間入力 |
| **Read** | F-020, F-021 | 今日・今週の期間ビュー |
| **Update** | F-023 | 過去の履歴編集 |
| **Delete** | F-024, F-008 | 履歴削除、またはタスク削除時の連動削除 |

---

## 4. ActiveTimer（計測中状態）

| 操作 | 機能ID | 説明 |
|------|--------|------|
| **Create** | F-013 | タイマー開始 |
| **Read** | F-015, F-017 | 経過時間表示、アプリ復帰時の計算 |
| **Update** | - | なし |
| **Delete** | F-014 | タイマー停止時に削除 |

---

## 5. 操作フロー概要

```
[タイマー開始]     → ActiveTimer Create
[タイマー停止]     → ActiveTimer Delete, SessionLog Create（日またぎ時は複数）
[手動時間入力]     → SessionLog Create（日またぎ時は分割）
[タスク削除]       → Task Delete, SessionLog Delete（該当 taskId のログ全削除）
[カテゴリー削除]   → Category Delete（空の場合のみ）
```
