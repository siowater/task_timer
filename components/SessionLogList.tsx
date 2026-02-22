/**
 * セッションログ一覧コンポーネント
 * 今日・今週の稼働表示
 * @see T-021-2 (#79), T-021-3 (#71)
 */

import { StyleSheet } from 'react-native';

import { Text, View } from '@/components/Themed';
import { useStore } from '@/store/useStore';
import { getSessionLogsByDate } from '@/store/selectors';
import type { SessionLog } from '@/types';

interface SessionLogListProps {
  /** 対象日付の配列（YYYY-MM-DD） */
  dateStrings: string[];
  /** セクションタイトル */
  title: string;
}

export function SessionLogList({ dateStrings, title }: SessionLogListProps) {
  const sessionLogs = useStore((state) => state.sessionLogs);
  const tasks = useStore((state) => state.tasks);

  const logs = getSessionLogsByDate(sessionLogs, dateStrings);
  const taskMap = new Map(tasks.map((t) => [t.id, t.name]));

  const totalMinutes = logs.reduce((s, l) => s + l.durationMinutes, 0);
  const totalHours = Math.floor(totalMinutes / 60);
  const totalMins = totalMinutes % 60;
  const totalStr =
    totalHours > 0 ? `${totalHours}時間${totalMins}分` : `${totalMins}分`;

  if (logs.length === 0) {
    return (
      <View style={styles.section} lightColor="#f5f5f5" darkColor="#1a1a1a">
        <Text style={styles.sectionTitle}>{title}</Text>
        <Text style={styles.emptyText}>記録がありません</Text>
      </View>
    );
  }

  return (
    <View style={styles.section} lightColor="#f5f5f5" darkColor="#1a1a1a">
      <Text style={styles.sectionTitle}>{title}</Text>
      <Text style={styles.totalText}>合計: {totalStr}</Text>
      <View style={styles.list}>
        {logs.map((log) => (
          <SessionLogItem
            key={log.id}
            log={log}
            taskName={taskMap.get(log.taskId) ?? '(削除済み)'}
          />
        ))}
      </View>
    </View>
  );
}

function SessionLogItem({
  log,
  taskName,
}: {
  log: SessionLog;
  taskName: string;
}) {
  return (
    <View style={styles.item} lightColor="#fff" darkColor="#2a2a2a">
      <Text style={styles.taskName}>{taskName}</Text>
      <Text style={styles.timeRange}>
        {log.date} {log.startTime} - {log.endTime}
      </Text>
      <Text style={styles.duration}>{log.durationMinutes}分</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  section: {
    borderRadius: 8,
    padding: 16,
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 4,
  },
  totalText: {
    fontSize: 13,
    opacity: 0.8,
    marginBottom: 12,
  },
  emptyText: {
    fontSize: 14,
    opacity: 0.7,
  },
  list: {
    gap: 8,
  },
  item: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderRadius: 6,
  },
  taskName: {
    flex: 1,
    fontSize: 14,
    fontWeight: '500',
  },
  timeRange: {
    fontSize: 12,
    opacity: 0.8,
    marginHorizontal: 8,
  },
  duration: {
    fontSize: 14,
    fontWeight: '600',
  },
});
