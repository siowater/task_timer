/**
 * タスク一覧コンポーネント
 * アクティブを先に、アーカイブをグレーアウトで表示
 * @see F-006, F-012
 */

import { StyleSheet } from 'react-native';

import { Text, View } from '@/components/Themed';
import { useStore } from '@/store/useStore';
import { getTasksByParentId } from '@/store/selectors';
import type { Task } from '@/types';

interface TaskListProps {
  /** 親カテゴリーID。null の場合はルート直下 */
  parentId: string | null;
}

export function TaskList({ parentId }: TaskListProps) {
  const tasks = useStore((state) =>
    getTasksByParentId(state.tasks, parentId)
  );

  const activeTasks = tasks.filter((t) => t.status === 'active');
  const archivedTasks = tasks.filter((t) => t.status === 'archived');

  if (tasks.length === 0) {
    return (
      <View style={styles.empty} lightColor="#f5f5f5" darkColor="#1a1a1a">
        <Text style={styles.emptyText}>タスクがありません</Text>
      </View>
    );
  }

  return (
    <View style={styles.list}>
      {activeTasks.map((task) => (
        <TaskItem key={task.id} task={task} archived={false} />
      ))}
      {archivedTasks.length > 0 && (
        <>
          <View style={styles.archivedHeader}>
            <Text style={styles.archivedHeaderText}>完了済み</Text>
          </View>
          {archivedTasks.map((task) => (
            <TaskItem key={task.id} task={task} archived={true} />
          ))}
        </>
      )}
    </View>
  );
}

function TaskItem({ task, archived }: { task: Task; archived: boolean }) {
  return (
    <View style={[styles.item, archived && styles.itemArchived]}>
      <Text
        style={[styles.itemText, archived && styles.itemTextArchived]}
        lightColor={archived ? '#888' : undefined}
        darkColor={archived ? '#666' : undefined}
      >
        {task.name}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  list: {
    borderRadius: 8,
    overflow: 'hidden',
  },
  item: {
    paddingVertical: 12,
    paddingHorizontal: 16,
  },
  itemArchived: {
    opacity: 0.8,
  },
  itemText: {
    fontSize: 16,
  },
  itemTextArchived: {
    textDecorationLine: 'line-through',
  },
  archivedHeader: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    marginTop: 8,
  },
  archivedHeaderText: {
    fontSize: 12,
    opacity: 0.7,
  },
  empty: {
    minHeight: 80,
    borderRadius: 8,
    padding: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyText: {
    fontSize: 14,
    opacity: 0.7,
  },
});
