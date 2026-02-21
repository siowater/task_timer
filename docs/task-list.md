# タスク一覧 (Task List)

## 概要
開発タスクを細分化し、各サブタスクを GitHub Issue で管理する。
1サブタスク = 1コミット単位を目安とする。
参照: [feature-list.md](./feature-list.md), [progress.md](./progress.md)

---

## 1. タスク一覧（開発順・細分化版）

### Phase 0: プロジェクト初期化

| # | サブタスク | 説明 | Issue |
|---|------------|------|-------|
| T-001-1 | create-expo-app 実行 | npx create-expo-app でプロジェクト初期化、Expo SDK 52+ 指定 | [#26](https://github.com/siowater/task_timer/issues/26) |
| T-001-2 | プロジェクト構成確認 | フォルダ構成・package.json の確認 | [#28](https://github.com/siowater/task_timer/issues/28) |
| T-002-1 | コア依存のインストール | Zustand, react-native-mmkv をインストール | [#27](https://github.com/siowater/task_timer/issues/27) |
| T-002-2 | NativeWind のインストール・設定 | NativeWind と Tailwind 設定 | [#30](https://github.com/siowater/task_timer/issues/30) |
| T-002-3 | Expo Router のインストール・設定 | ファイルベースルーティングの設定 | [#29](https://github.com/siowater/task_timer/issues/29) |
| T-003-1 | 開発サーバー起動確認 | npx expo start でエラーなく起動 | [#31](https://github.com/siowater/task_timer/issues/31) |
| T-003-2 | 画面表示確認 | エミュレータ/実機で初期画面が表示されることを確認 | [#32](https://github.com/siowater/task_timer/issues/32) |

### Phase 1: 基盤

| # | サブタスク | 説明 | Issue |
|---|------------|------|-------|
| T-004-1 | Category 型定義 | Category インターフェースの作成 | [#33](https://github.com/siowater/task_timer/issues/33) |
| T-004-2 | Task 型定義 | Task インターフェースの作成 | [#36](https://github.com/siowater/task_timer/issues/36) |
| T-004-3 | SessionLog・ActiveTimer 型定義 | SessionLog, ActiveTimer の型作成 | [#39](https://github.com/siowater/task_timer/issues/39) |
| T-004-4 | 定数定義 | MAX_ACTIVE_TASKS, MAX_SESSION_HOURS 等 | [#40](https://github.com/siowater/task_timer/issues/40) |
| T-005-1 | Store 骨格作成 | 空の categories, tasks, sessionLogs, activeTimers | [#34](https://github.com/siowater/task_timer/issues/34) |
| T-005-2 | Store アクション枠 | 各アクションの関数シグネチャのみ定義 | [#37](https://github.com/siowater/task_timer/issues/37) |
| T-006-1 | MMKV ストレージ設定 | react-native-mmkv の初期化・ストレージ作成 | [#35](https://github.com/siowater/task_timer/issues/35) |
| T-006-2 | persist ミドルウェア適用 | Zustand persist で Store を MMKV に同期 | [#38](https://github.com/siowater/task_timer/issues/38) |

### Phase 2: カテゴリー CRUD

| # | サブタスク | 説明 | Issue |
|---|------------|------|-------|
| T-007-1 | addCategory アクション | カテゴリー追加ロジック（Level 4 チェック含む） | [#41](https://github.com/siowater/task_timer/issues/41) |
| T-007-2 | addCategory のテスト | 追加・Level 4 制限の単体テスト | [#43](https://github.com/siowater/task_timer/issues/43) |
| T-008-1 | deleteCategory アクション | 空チェック後削除、エラー時は Toast 用戻り値 | [#47](https://github.com/siowater/task_timer/issues/47) |
| T-008-2 | deleteCategory のテスト | 空/非空時の単体テスト | [#51](https://github.com/siowater/task_timer/issues/51) |
| T-009-1 | reorderCategory アクション | 同一階層内で order 更新 | [#42](https://github.com/siowater/task_timer/issues/42) |
| T-009-2 | reorderCategory のテスト | 並び替えの単体テスト | [#45](https://github.com/siowater/task_timer/issues/45) |
| T-010-1 | ルートレイアウト | app/_layout.tsx の作成 | [#49](https://github.com/siowater/task_timer/issues/49) |
| T-010-2 | ルート画面スケルトン | app/index.tsx でカテゴリー・タスク一覧の枠 | [#53](https://github.com/siowater/task_timer/issues/53) |
| T-010-3 | カテゴリー・タスクリストコンポーネント | 一覧表示用コンポーネント | [#44](https://github.com/siowater/task_timer/issues/44) |
| T-010-4 | 新規追加ボタン | カテゴリー・タスク追加ボタンの配置 | [#48](https://github.com/siowater/task_timer/issues/48) |
| T-011-1 | カテゴリー動的ルート | app/category/[id].tsx の作成 | [#52](https://github.com/siowater/task_timer/issues/52) |
| T-011-2 | 子階層データ取得 | parentId で子カテゴリー・タスクをフィルタ | [#54](https://github.com/siowater/task_timer/issues/54) |
| T-011-3 | Level 4 での追加ボタン非表示 | 条件分岐で新規カテゴリー追加を非表示 | [#46](https://github.com/siowater/task_timer/issues/46) |
| T-011-4 | 戻るナビゲーション | 親階層への遷移 | [#50](https://github.com/siowater/task_timer/issues/50) |

### Phase 2: タスク CRUD

| # | サブタスク | 説明 | Issue |
|---|------------|------|-------|
| T-012-1 | addTask アクション | 20個上限チェック付きでタスク追加 | [#55](https://github.com/siowater/task_timer/issues/55) |
| T-012-2 | addTask のテスト | 上限チェックの単体テスト | [#58](https://github.com/siowater/task_timer/issues/58) |
| T-013-1 | deleteTask アクション | タスク削除＋紐づく SessionLog 削除 | [#61](https://github.com/siowater/task_timer/issues/61) |
| T-013-2 | deleteTask のテスト | 削除・ログ連動の単体テスト | [#64](https://github.com/siowater/task_timer/issues/64) |
| T-014-1 | archiveTask アクション | status を archived に更新 | [#56](https://github.com/siowater/task_timer/issues/56) |
| T-014-2 | restoreTask アクション | 20個チェック後、status を active に | [#59](https://github.com/siowater/task_timer/issues/59) |
| T-014-3 | archive/restore のテスト | アーカイブ・復元・上限の単体テスト | [#62](https://github.com/siowater/task_timer/issues/62) |
| T-015-1 | reorderTask アクション | 同一階層内で order 更新 | [#66](https://github.com/siowater/task_timer/issues/66) |
| T-015-2 | reorderTask のテスト | 並び替えの単体テスト | [#57](https://github.com/siowater/task_timer/issues/57) |
| T-016-1 | タスクリスト表示 | アクティブ・アーカイブを一覧表示 | [#60](https://github.com/siowater/task_timer/issues/60) |
| T-016-2 | アーカイブのグレーアウト表示 | 完了済みスタイル適用 | [#63](https://github.com/siowater/task_timer/issues/63) |
| T-016-3 | 削除・復元 UI | アーカイブタスクからの操作ボタン | [#65](https://github.com/siowater/task_timer/issues/65) |

### Phase 3: タイマー・ログ

| # | サブタスク | 説明 | Issue |
|---|------------|------|-------|
| T-017-1 | startTimer アクション | ActiveTimer に taskId, startTime を追加 | [#67](https://github.com/siowater/task_timer/issues/67) |
| T-017-2 | stopTimer アクション | 経過時間計算、24時間上限で丸め、ログ記録 | [#69](https://github.com/siowater/task_timer/issues/69) |
| T-017-3 | 24時間上限のテスト | 超えた場合の丸め・Toast 条件のテスト | [#72](https://github.com/siowater/task_timer/issues/72) |
| T-018-1 | 日またぎ分割ユーティリティ | 0時跨ぎで2レコードに分割する関数 | [#75](https://github.com/siowater/task_timer/issues/75) |
| T-018-2 | 日またぎ分割のテスト | 分割ロジックの単体テスト | [#68](https://github.com/siowater/task_timer/issues/68) |
| T-018-3 | stopTimer への日またぎ統合 | 分割結果を SessionLog に保存 | [#73](https://github.com/siowater/task_timer/issues/73) |
| T-019-1 | AppState 復帰時の経過時間計算 | startTime と現在時刻の差分計算 | [#76](https://github.com/siowater/task_timer/issues/76) |
| T-019-2 | 復帰時のログ記録 | 計算結果を SessionLog に保存 | [#78](https://github.com/siowater/task_timer/issues/78) |
| T-020-1 | タイマー開始・停止ボタン | タスクごとの Start/Stop UI | [#70](https://github.com/siowater/task_timer/issues/70) |
| T-020-2 | 経過時間リアルタイム表示 | 計測中の経過時間表示 | [#74](https://github.com/siowater/task_timer/issues/74) |
| T-021-1 | 履歴画面ルート | app/history/index.tsx の作成 | [#77](https://github.com/siowater/task_timer/issues/77) |
| T-021-2 | 今日の稼働表示 | 今日のセッションログ一覧 | [#79](https://github.com/siowater/task_timer/issues/79) |
| T-021-3 | 今週の稼働表示 | 今週のセッションログ一覧 | [#71](https://github.com/siowater/task_timer/issues/71) |

### Phase 4: 手動入力・編集

| # | サブタスク | 説明 | Issue |
|---|------------|------|-------|
| T-022-1 | 手動入力モーダル UI | 日付・開始・終了・タスク選択フォーム | [#80](https://github.com/siowater/task_timer/issues/80) |
| T-022-2 | addSessionLog アクション | 手動入力用、日またぎ分割対応 | [#83](https://github.com/siowater/task_timer/issues/83) |
| T-022-3 | 手動入力のバリデーション | 時間整合性チェック | [#86](https://github.com/siowater/task_timer/issues/86) |
| T-023-1 | updateSessionLog アクション | 既存ログの更新 | [#89](https://github.com/siowater/task_timer/issues/89) |
| T-023-2 | deleteSessionLog アクション | 既存ログの削除 | [#81](https://github.com/siowater/task_timer/issues/81) |
| T-023-3 | 履歴編集・削除 UI | 一覧からの編集・削除操作 | [#84](https://github.com/siowater/task_timer/issues/84) |

### Phase 5: UI 仕上げ

| # | サブタスク | 説明 | Issue |
|---|------------|------|-------|
| T-024-1 | Toast コンポーネント導入 | エラー表示用 Toast ライブラリ設定 | [#87](https://github.com/siowater/task_timer/issues/87) |
| T-024-2 | バリデーションエラー時の Toast | 各バリデーションで Toast 表示 | [#90](https://github.com/siowater/task_timer/issues/90) |
| T-025-1 | Drag & Drop ライブラリ導入 | 並び替え用 D&D ライブラリ設定 | [#82](https://github.com/siowater/task_timer/issues/82) |
| T-025-2 | カテゴリー D&D 並び替え UI | カテゴリーリストでの D&D | [#85](https://github.com/siowater/task_timer/issues/85) |
| T-025-3 | タスク D&D 並び替え UI | タスクリストでの D&D | [#88](https://github.com/siowater/task_timer/issues/88) |

---

## 2. サブタスク数サマリ

| Phase | サブタスク数 |
|-------|--------------|
| Phase 0 | 7 |
| Phase 1 | 8 |
| Phase 2 カテゴリー | 14 |
| Phase 2 タスク | 13 |
| Phase 3 | 13 |
| Phase 4 | 6 |
| Phase 5 | 5 |
| **合計** | **66** |

---

## 3. GitHub Issue との紐付け

上記の各サブタスクに対応する GitHub Issue を作成済み（#26〜#90）。
- リポジトリ: https://github.com/siowater/task_timer
- Issue 一覧: https://github.com/siowater/task_timer/issues

---

## 4. 開発ルール

- 1サブタスク完了ごとにコミット・プッシュを推奨
- ロジックタスクには TDD で先にテストを作成
- コミットメッセージに Issue 番号を含める（例: `fix: addCategory action #26`）
