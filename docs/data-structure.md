# データ構造定義 (Data Structure)

## 概要
RDB は使用せず、Zustand Store を単一のステートツリーとしてメモリ上に展開し、MMKV に永続化する。
参照: [requirements.md](./requirements.md), [domain-definition.md](./domain-definition.md)

---

## 1. Store 全体構造

```typescript
interface AppState {
  categories: Category[];
  tasks: Task[];
  sessionLogs: SessionLog[];
  activeTimers: ActiveTimer[];  // 計測中のタスク
}
```

---

## 2. 型定義

### 2.1 Category

```typescript
interface Category {
  id: string;
  name: string;
  parentId: string | null;  // null = ルート直下
  order: number;
  level: 1 | 2 | 3 | 4;
  createdAt?: string;  // ISO8601（任意）
}
```

### 2.2 Task

```typescript
interface Task {
  id: string;
  name: string;
  parentId: string | null;  // null = ルート直下
  order: number;
  status: "active" | "archived";
  createdAt?: string;
}
```

### 2.3 SessionLog

```typescript
interface SessionLog {
  id: string;
  taskId: string;
  date: string;           // YYYY-MM-DD
  startTime: string;      // HH:mm または ISO8601
  endTime: string;
  durationMinutes: number;
  createdAt?: string;
}
```

### 2.4 ActiveTimer（計測中）

```typescript
interface ActiveTimer {
  taskId: string;
  startTime: string;      // ISO8601（アプリ復帰時の計算用）
}
```

---

## 3. ID 生成方針

| エンティティ | 方針 |
|--------------|------|
| Category | `crypto.randomUUID()` または `nanoid` 等 |
| Task | 同上 |
| SessionLog | 同上 |

---

## 4. 永続化

| 項目 | 内容 |
|------|------|
| ストレージ | react-native-mmkv |
| ミドルウェア | Zustand `persist` |
| 同期対象 | Store 全体（categories, tasks, sessionLogs, activeTimers） |
| 形式 | JSON シリアライズ |

---

## 5. インデックス・参照整合性

- `Task.parentId` → `Category.id` または null
- `Category.parentId` → `Category.id` または null
- `SessionLog.taskId` → `Task.id`
- `ActiveTimer.taskId` → `Task.id`

※ RDB ではないため、アプリケーション層で整合性を保つ。

---

## 6. 定数

```typescript
const MAX_ACTIVE_TASKS = 20;
const MAX_SESSION_HOURS = 24;
const MAX_CATEGORY_LEVEL = 4;
```
