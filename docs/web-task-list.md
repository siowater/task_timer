# Web アプリ移行タスク一覧 (Web Task List)

## 概要
Issue #95, #96, #97 に基づく大規模リニューアルのタスク一覧。
- **#97**: Expo をやめて Web アプリとして構成
- **#96**: カテゴリー機能を全削除
- **#95**: トップページレイアウト変更

**技術スタック**: Next.js (App Router), TypeScript, Tailwind CSS, Supabase

---

## 1. タスク一覧（開発順）

### Phase 1: Web アプリ基盤 (#97)

| # | サブタスク | 説明 | Issue |
|---|------------|------|-------|
| W-001 | Next.js プロジェクト作成 | create-next-app（App Router, TypeScript, Tailwind） | [#98](https://github.com/siowater/task_timer/issues/98) ✅ |
| W-002 | Supabase プロジェクト設定 | プロジェクト作成・接続・環境変数 | [#100](https://github.com/siowater/task_timer/issues/100) ✅ |
| W-003 | データモデル定義 | タスク・セッションログ・アクティブタイマー（カテゴリーなし） | [#99](https://github.com/siowater/task_timer/issues/99) ✅ |
| W-004 | 最小起動確認 | 開発サーバー起動・画面表示確認 | [#101](https://github.com/siowater/task_timer/issues/101) ✅ |

### Phase 2: タスク・タイマー機能 (#96 反映)

| # | サブタスク | 説明 | Issue |
|---|------------|------|-------|
| W-005 | タスク CRUD（Supabase） | テーブル作成・CRUD API・型定義 | [#102](https://github.com/siowater/task_timer/issues/102) |
| W-006 | タスク一覧 UI | 追加・削除・アーカイブ・復元（フラットリスト） | [#103](https://github.com/siowater/task_timer/issues/103) |
| W-007 | タイマー開始・停止・経過時間 | 計測ロジック・リアルタイム表示 | [#104](https://github.com/siowater/task_timer/issues/104) |
| W-008 | 日またぎ分割・24時間上限 | ロジック・バリデーション | [#105](https://github.com/siowater/task_timer/issues/105) |
| W-009 | タスク並び替え | D&D による order 更新 | [#107](https://github.com/siowater/task_timer/issues/107) |

### Phase 3: 稼働履歴

| # | サブタスク | 説明 | Issue |
|---|------------|------|-------|
| W-010 | セッションログ記録・表示 | 記録・一覧表示 | [#108](https://github.com/siowater/task_timer/issues/108) |
| W-011 | 期間ビュー | 今日・今週の稼働表示 | [#110](https://github.com/siowater/task_timer/issues/110) |
| W-012 | 手動時間入力 | 手動追加モーダル | [#112](https://github.com/siowater/task_timer/issues/112) |
| W-013 | 履歴編集・削除 | 編集・削除 UI | [#106](https://github.com/siowater/task_timer/issues/106) |

### Phase 4: レイアウト・UI (#95)

| # | サブタスク | 説明 | Issue |
|---|------------|------|-------|
| W-014 | トップページレイアウト | #95 添付画像のデザインに準拠 | [#109](https://github.com/siowater/task_timer/issues/109) |
| W-015 | Toast・バリデーション UI | エラー表示・バリデーション | [#111](https://github.com/siowater/task_timer/issues/111) |

### Phase 5: 仕上げ

| # | サブタスク | 説明 | Issue |
|---|------------|------|-------|
| W-016 | テスト・ドキュメント | 単体テスト・ドキュメント整備 | [#113](https://github.com/siowater/task_timer/issues/113) |

---

## 2. 親 Issue との対応

| 親 Issue | 対応タスク |
|----------|------------|
| #97 | W-001〜W-004, W-005〜W-016 |
| #96 | W-003, W-005〜W-009 |
| #95 | W-014 |
