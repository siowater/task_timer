/**
 * タスク一覧コンポーネント
 * アクティブを先に、アーカイブをグレーアウトで表示。アーカイブから削除・復元可能。
 * タイマー開始・停止ボタン、経過時間のリアルタイム表示。D&D で並び替え可能。
 * @see F-006, F-012, T-016-1 (#60), T-016-2 (#63), T-016-3 (#65)
 * @see T-020-1 (#70), T-020-2 (#74), T-025-3 (#88)
 */

import FontAwesome from '@expo/vector-icons/FontAwesome';
import DraggableFlatList, {
  RenderItemParams,
  ScaleDecorator,
} from 'react-native-draggable-flatlist';
import { Alert, Pressable, StyleSheet } from 'react-native';

import { Text, View, useThemeColor } from '@/components/Themed';
import { useStore } from '@/store/useStore';
import { getTasksByParentId } from '@/store/selectors';
import type { Task } from '@/types';
import { useElapsedTime } from '@/hooks/useElapsedTime';
import { formatElapsedSeconds } from '@/utils/formatElapsed';
import { showInfoToast } from '@/utils/toast';

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
  const reorderTask = useStore((state) => state.reorderTask);

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

  const handleActiveDragEnd = ({ data, to }: { data: Task[]; to: number }) => {
    if (to >= 0 && to < data.length) {
      reorderTask(data[to].id, to);
    }
  };

  const handleArchivedDragEnd = ({ data, to }: { data: Task[]; to: number }) => {
    if (to >= 0 && to < data.length) {
      reorderTask(data[to].id, activeTasks.length + to);
    }
  };

  const renderActiveItem = ({ item, drag, isActive }: RenderItemParams<Task>) => (
    <ScaleDecorator>
      <View style={[styles.dragRow, isActive && styles.dragRowActive]}>
        <Pressable onLongPress={drag} style={styles.dragHandle}>
          <FontAwesome name="bars" size={14} color="#999" />
        </Pressable>
        <TaskItem task={item} archived={false} />
      </View>
    </ScaleDecorator>
  );

  const renderArchivedItem = ({ item, drag, isActive }: RenderItemParams<Task>) => (
    <ScaleDecorator>
      <View style={[styles.dragRow, isActive && styles.dragRowActive]}>
        <Pressable onLongPress={drag} style={styles.dragHandle}>
          <FontAwesome name="bars" size={14} color="#999" />
        </Pressable>
        <TaskItem
          task={item}
          archived={true}
          onRestore={() => restoreTask(item.id)}
          onDelete={() => handleDelete(item)}
        />
      </View>
    </ScaleDecorator>
  );

  if (tasks.length === 0) {
    return (
      <View style={styles.empty} lightColor="#f5f5f5" darkColor="#1a1a1a">
        <Text style={styles.emptyText}>タスクがありません</Text>
      </View>
    );
  }

  return (
    <View style={styles.list}>
      <DraggableFlatList
        data={activeTasks}
        keyExtractor={(item) => item.id}
        renderItem={renderActiveItem}
        onDragEnd={handleActiveDragEnd}
        scrollEnabled={false}
        containerStyle={styles.dragList}
      />
      {archivedTasks.length > 0 && (
        <>
          <View style={styles.archivedHeader}>
            <Text style={styles.archivedHeaderText}>完了済み</Text>
          </View>
          <DraggableFlatList
            data={archivedTasks}
            keyExtractor={(item) => item.id}
            renderItem={renderArchivedItem}
            onDragEnd={handleArchivedDragEnd}
            scrollEnabled={false}
            containerStyle={styles.dragList}
          />
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

  const activeTimer = useStore((state) =>
    state.activeTimers.find((t) => t.taskId === task.id)
  );
  const startTimer = useStore((state) => state.startTimer);
  const stopTimer = useStore((state) => state.stopTimer);

  const elapsedSeconds = useElapsedTime(activeTimer?.startTime ?? null);
  const isTiming = !!activeTimer;

  const handleStart = () => startTimer(task.id);
  const handleStop = () => {
    const result = stopTimer(task.id);
    if (result.capped) {
      showInfoToast('24時間を超えたため、24時間で記録しました');
    }
  };

  return (
    <View style={[styles.item, archived && styles.itemArchived]}>
      <View style={styles.itemMain}>
        <Text
          style={[styles.itemText, archived && styles.itemTextArchived]}
          lightColor={archived ? '#888' : undefined}
          darkColor={archived ? '#666' : undefined}
        >
          {task.name}
        </Text>
        {!archived && isTiming && (
          <Text style={styles.elapsed} lightColor="#666" darkColor="#999">
            {formatElapsedSeconds(elapsedSeconds)}
          </Text>
        )}
      </View>
      {!archived && (
        <View style={styles.actions}>
          {isTiming ? (
            <Pressable
              onPress={handleStop}
              style={({ pressed }) => [
                styles.timerButton,
                styles.stopButton,
                pressed && styles.actionPressed,
              ]}
            >
              <FontAwesome name="stop" size={16} color="#fff" />
              <Text style={styles.timerButtonText}>停止</Text>
            </Pressable>
          ) : (
            <Pressable
              onPress={handleStart}
              style={({ pressed }) => [
                styles.timerButton,
                { borderColor: tintColor },
                pressed && styles.actionPressed,
              ]}
            >
              <FontAwesome name="play" size={16} color={tintColor} />
              <Text style={[styles.timerButtonText, { color: tintColor }]}>
                開始
              </Text>
            </Pressable>
          )}
        </View>
      )}
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
  dragList: {
    flex: 0,
  },
  dragRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  dragRowActive: {
    opacity: 0.9,
  },
  dragHandle: {
    paddingVertical: 12,
    paddingHorizontal: 8,
    marginRight: 4,
  },
  item: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 12,
    paddingHorizontal: 16,
  },
  itemArchived: {
    opacity: 0.8,
  },
  itemMain: {
    flex: 1,
  },
  itemText: {
    fontSize: 16,
  },
  elapsed: {
    fontSize: 12,
    marginTop: 2,
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
  timerButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 6,
    borderWidth: 1,
  },
  stopButton: {
    backgroundColor: '#e53935',
    borderColor: '#e53935',
  },
  timerButtonText: {
    fontSize: 13,
    fontWeight: '600',
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
