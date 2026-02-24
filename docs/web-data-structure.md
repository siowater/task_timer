# Web アプリ データ構造定義

## 概要
Supabase (PostgreSQL) を使用。カテゴリーなしのフラット構成。
参照: [requirements.md](./requirements.md), Issue #96

---

## 1. 型定義

### 1.1 Task

```typescript
interface Task {
  id: string;
  name: string;
  order: number;
  status: 'active' | 'archived';
  createdAt?: string;
}
```

### 1.2 SessionLog

```typescript
interface SessionLog {
  id: string;
  taskId: string;
  date: string;           // YYYY-MM-DD
  startTime: string;      // HH:mm
  endTime: string;
  durationMinutes: number;
  createdAt?: string;
}
```

### 1.3 ActiveTimer

```typescript
interface ActiveTimer {
  taskId: string;
  startTime: string;      // ISO8601
}
```

※ ActiveTimer はクライアント側（localStorage）または DB で管理。W-005 以降で実装方針を確定。

---

## 2. テーブル設計（Supabase）

### 2.1 tasks

| カラム | 型 | 制約 | 説明 |
|--------|-----|------|------|
| id | uuid | PK, default gen_random_uuid() | 一意識別子 |
| name | text | NOT NULL | 表示名 |
| order | integer | NOT NULL, default 0 | 表示順 |
| status | text | NOT NULL, check (status IN ('active','archived')) | アクティブ/アーカイブ |
| created_at | timestamptz | default now() | 作成日時 |

### 2.2 session_logs

| カラム | 型 | 制約 | 説明 |
|--------|-----|------|------|
| id | uuid | PK, default gen_random_uuid() | 一意識別子 |
| task_id | uuid | FK → tasks(id) ON DELETE CASCADE | タスクID |
| date | date | NOT NULL | 日付 |
| start_time | text | NOT NULL | 開始時刻 HH:mm |
| end_time | text | NOT NULL | 終了時刻 HH:mm |
| duration_minutes | integer | NOT NULL, check (>= 0) | 分数 |
| created_at | timestamptz | default now() | 作成日時 |

### 2.3 active_timers（オプション）

| カラム | 型 | 制約 | 説明 |
|--------|-----|------|------|
| task_id | uuid | PK, FK → tasks(id) ON DELETE CASCADE | タスクID |
| start_time | timestamptz | NOT NULL | 開始日時 |

※ 1タスク1タイマーの想定。複数タスク同時計測は要検討。

---

## 3. 定数

| 定数 | 値 | 説明 |
|------|-----|------|
| MAX_ACTIVE_TASKS | 20 | アクティブタスク上限 |
| MAX_SESSION_HOURS | 24 | 1回の計測上限（時間） |

---

## 4. 参照整合性

- `session_logs.task_id` → `tasks.id` (CASCADE DELETE)
- `active_timers.task_id` → `tasks.id` (CASCADE DELETE)
