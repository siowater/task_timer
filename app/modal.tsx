/**
 * 手動入力モーダル
 * 日付・開始・終了・タスク選択フォーム
 * @see T-022-1 (#80)
 */

import { useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import {
  Alert,
  Pressable,
  ScrollView,
  StyleSheet,
  TextInput,
} from 'react-native';

import { Text, View, useThemeColor } from '@/components/Themed';
import { useStore } from '@/store/useStore';
import { getTodayDateString } from '@/utils/dateHelpers';
import { showErrorToast } from '@/utils/toast';

export default function ManualEntryModal() {
  const router = useRouter();
  const tintColor = useThemeColor({}, 'tint');

  const tasks = useStore((state) =>
    state.tasks.filter((t) => t.status === 'active').sort((a, b) => a.order - b.order)
  );
  const addSessionLog = useStore((state) => state.addSessionLog);

  const [date, setDate] = useState(getTodayDateString());
  const [startTime, setStartTime] = useState('09:00');
  const [endTime, setEndTime] = useState('10:00');
  const [taskId, setTaskId] = useState('');
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (tasks.length > 0 && !taskId) {
      setTaskId(tasks[0].id);
    }
  }, [tasks, taskId]);

  const handleSubmit = () => {
    setError(null);
    const selectedTaskId = taskId || tasks[0]?.id;
    if (!selectedTaskId) {
      const msg = 'タスクを選択してください';
      setError(msg);
      showErrorToast(msg);
      return;
    }
    const result = addSessionLog({
      taskId: selectedTaskId,
      date,
      startTime,
      endTime,
    });

    if (result.success) {
      router.back();
    } else {
      const msg = result.error ?? '入力に誤りがあります';
      setError(msg);
      showErrorToast(msg);
    }
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <Text style={styles.title}>手動入力</Text>

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
        {tasks.length === 0 && (
          <Text style={styles.hint}>アクティブなタスクがありません</Text>
        )}
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
        <Text style={styles.error}>{error}</Text>
      )}

      <Pressable
        onPress={handleSubmit}
        style={({ pressed }) => [
          styles.submitButton,
          { backgroundColor: tintColor },
          pressed && styles.pressed,
        ]}
      >
        <Text style={styles.submitText}>追加</Text>
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
  hint: {
    fontSize: 13,
    opacity: 0.7,
    marginTop: 4,
  },
  error: {
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
