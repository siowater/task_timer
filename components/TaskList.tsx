/**
 * タスク一覧コンポーネント
 * アクティブを先に、アーカイブをグレーアウトで表示。アーカイブから削除・復元可能。
 * @see F-006, F-012, T-016-1 (#60), T-016-2 (#63), T-016-3 (#65)
 */

import FontAwesome from '@expo/vector-icons/FontAwesome';
import { Alert, Pressable, StyleSheet } from 'react-native';

import { Text, View, useThemeColor } from '@/components/Themed';
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
  const deleteTask = useStore((state) => state.deleteTask);
  const restoreTask = useStore((state) => state.restoreTask);

  const activeTasks = tasks.filter((t) => t.status === 'active');
  const archivedTasks = tasks.filter((t) => t.status === 'archived');

  const handleDelete = (task: Task) => {
    Alert.alert(
      'タスクを削除',
      `「${task.name}」を削除しますか？`,
      [
        { text: 'キャンセル', style: 'cancel' },
        { text: '削除', style: 'destructive', onPress: () => deleteTask(task.id) },
      ]
    );
  };

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
            <TaskItem
              key={task.id}
              task={task}
              archived={true}
              onRestore={() => restoreTask(task.id)}
              onDelete={() => handleDelete(task)}
            />
          ))}
        </>
      )}
    </View>
  );
}

interface TaskItemProps {
  task: Task;
  archived: boolean;
  onRestore?: () => void;
  onDelete?: () => void;
}

function TaskItem({ task, archived, onRestore, onDelete }: TaskItemProps) {
  const tintColor = useThemeColor({}, 'tint');
  const textColor = useThemeColor({}, 'text');

  return (
    <View style={[styles.item, archived && styles.itemArchived]}>
      <Text
        style={[styles.itemText, archived && styles.itemTextArchived]}
        lightColor={archived ? '#888' : undefined}
        darkColor={archived ? '#666' : undefined}
      >
        {task.name}
      </Text>
      {archived && onRestore && onDelete && (
        <View style={styles.actions}>
          <Pressable
            onPress={onRestore}
            style={({ pressed }) => [styles.actionButton, pressed && styles.actionPressed]}
          >
            <FontAwesome name="undo" size={16} color={tintColor} />
            <Text style={[styles.actionText, { color: tintColor }]}>復元</Text>
          </Pressable>
          <Pressable
            onPress={onDelete}
            style={({ pressed }) => [styles.actionButton, pressed && styles.actionPressed]}
          >
            <FontAwesome name="trash-o" size={16} color={textColor} />
            <Text style={styles.actionText}>削除</Text>
          </Pressable>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  list: {
    borderRadius: 8,
    overflow: 'hidden',
  },
  item: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 12,
    paddingHorizontal: 16,
  },
  itemArchived: {
    opacity: 0.8,
  },
  itemText: {
    flex: 1,
    fontSize: 16,
  },
  itemTextArchived: {
    textDecorationLine: 'line-through',
  },
  actions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingVertical: 4,
    paddingHorizontal: 8,
  },
  actionPressed: {
    opacity: 0.6,
  },
  actionText: {
    fontSize: 13,
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
