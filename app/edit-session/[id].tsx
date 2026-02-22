/**
 * 履歴編集モーダル
 * 日付・開始・終了・タスク選択フォーム
 * @see T-023-3 (#84)
 */

import { useLocalSearchParams, useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import {
  Pressable,
  ScrollView,
  StyleSheet,
  TextInput,
} from 'react-native';

import { Text, View, useThemeColor } from '@/components/Themed';
import { useStore } from '@/store/useStore';

export default function EditSessionModal() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const tintColor = useThemeColor({}, 'tint');

  const sessionLogs = useStore((state) => state.sessionLogs);
  const allTasks = useStore((state) => state.tasks);
  const updateSessionLog = useStore((state) => state.updateSessionLog);

  const log = sessionLogs.find((l) => l.id === id);
  const tasks = allTasks
    .filter((t) => t.status === 'active' || t.id === log?.taskId)
    .sort((a, b) => (a.status === 'active' ? 0 : 1) - (b.status === 'active' ? 0 : 1))
    .sort((a, b) => a.order - b.order);

  const [date, setDate] = useState(log?.date ?? '');
  const [startTime, setStartTime] = useState(log?.startTime ?? '');
  const [endTime, setEndTime] = useState(log?.endTime ?? '');
  const [taskId, setTaskId] = useState(log?.taskId ?? '');
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (log) {
      setDate(log.date);
      setStartTime(log.startTime);
      setEndTime(log.endTime);
      setTaskId(log.taskId);
    }
  }, [log?.id]);

  if (!log) {
    return (
      <View style={styles.container}>
        <Text style={styles.title}>編集</Text>
        <Text style={styles.errorText}>セッションが見つかりません</Text>
        <Pressable
          onPress={() => router.back()}
          style={({ pressed }) => [styles.cancelButton, pressed && styles.pressed]}
        >
          <Text style={styles.cancelText}>戻る</Text>
        </Pressable>
      </View>
    );
  }

  const handleSubmit = () => {
    setError(null);
    const selectedTaskId = taskId || log.taskId;
    if (!selectedTaskId) {
      setError('タスクを選択してください');
      return;
    }
    const result = updateSessionLog(id!, {
      taskId: selectedTaskId,
      date,
      startTime,
      endTime,
    });

    if (result.success) {
      router.back();
    } else {
      setError(result.error ?? '入力に誤りがあります');
    }
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <Text style={styles.title}>履歴を編集</Text>

      <View style={styles.field}>
        <Text style={styles.label}>タスク</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.taskRow}>
          {tasks.map((task) => (
            <Pressable
              key={task.id}
              onPress={() => setTaskId(task.id)}
              style={[
                styles.taskChip,
                taskId === task.id && { backgroundColor: tintColor, opacity: 0.9 },
              ]}
            >
              <Text
                style={[
                  styles.taskChipText,
                  taskId === task.id && { color: '#fff' },
                ]}
              >
                {task.name}
              </Text>
            </Pressable>
          ))}
        </ScrollView>
      </View>

      <View style={styles.field}>
        <Text style={styles.label}>日付 (YYYY-MM-DD)</Text>
        <TextInput
          style={styles.input}
          value={date}
          onChangeText={setDate}
          placeholder="2025-02-21"
          placeholderTextColor="#999"
        />
      </View>

      <View style={styles.field}>
        <Text style={styles.label}>開始時刻 (HH:mm)</Text>
        <TextInput
          style={styles.input}
          value={startTime}
          onChangeText={setStartTime}
          placeholder="09:00"
          placeholderTextColor="#999"
        />
      </View>

      <View style={styles.field}>
        <Text style={styles.label}>終了時刻 (HH:mm)</Text>
        <TextInput
          style={styles.input}
          value={endTime}
          onChangeText={setEndTime}
          placeholder="10:00"
          placeholderTextColor="#999"
        />
      </View>

      {error && (
        <Text style={styles.errorText}>{error}</Text>
      )}

      <Pressable
        onPress={handleSubmit}
        style={({ pressed }) => [
          styles.submitButton,
          { backgroundColor: tintColor },
          pressed && styles.pressed,
        ]}
      >
        <Text style={styles.submitText}>保存</Text>
      </Pressable>

      <Pressable
        onPress={() => router.back()}
        style={({ pressed }) => [styles.cancelButton, pressed && styles.pressed]}
      >
        <Text style={styles.cancelText}>キャンセル</Text>
      </Pressable>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    padding: 20,
    paddingBottom: 40,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 24,
  },
  field: {
    marginBottom: 16,
  },
  label: {
    fontSize: 14,
    fontWeight: '500',
    marginBottom: 6,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
  },
  taskRow: {
    flexDirection: 'row',
    gap: 8,
    marginTop: 4,
  },
  taskChip: {
    paddingVertical: 8,
    paddingHorizontal: 14,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#ccc',
  },
  taskChipText: {
    fontSize: 14,
  },
  errorText: {
    color: '#e53935',
    fontSize: 14,
    marginBottom: 12,
  },
  submitButton: {
    paddingVertical: 14,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 8,
  },
  cancelButton: {
    paddingVertical: 12,
    alignItems: 'center',
    marginTop: 12,
  },
  cancelText: {
    fontSize: 16,
    opacity: 0.7,
  },
  submitText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  pressed: {
    opacity: 0.7,
  },
});
