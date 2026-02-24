-- Task Timer: 初期テーブル作成（カテゴリーなし）
-- W-003 データモデル定義

-- tasks
CREATE TABLE IF NOT EXISTS tasks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  "order" INTEGER NOT NULL DEFAULT 0,
  status TEXT NOT NULL CHECK (status IN ('active', 'archived')) DEFAULT 'active',
  created_at TIMESTAMPTZ DEFAULT now()
);

-- session_logs
CREATE TABLE IF NOT EXISTS session_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  task_id UUID NOT NULL REFERENCES tasks(id) ON DELETE CASCADE,
  date DATE NOT NULL,
  start_time TEXT NOT NULL,
  end_time TEXT NOT NULL,
  duration_minutes INTEGER NOT NULL CHECK (duration_minutes >= 0),
  created_at TIMESTAMPTZ DEFAULT now()
);

-- session_logs にインデックス
CREATE INDEX IF NOT EXISTS idx_session_logs_task_id ON session_logs(task_id);
CREATE INDEX IF NOT EXISTS idx_session_logs_date ON session_logs(date);

-- RLS 有効化（認証は後で設定）
ALTER TABLE tasks ENABLE ROW LEVEL SECURITY;
ALTER TABLE session_logs ENABLE ROW LEVEL SECURITY;

-- 全アクセス許可ポリシー（認証なしの暫定）
CREATE POLICY "Allow all on tasks" ON tasks FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow all on session_logs" ON session_logs FOR ALL USING (true) WITH CHECK (true);
