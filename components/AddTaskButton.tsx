/**
 * タスク追加ボタン
 * @see F-007
 */

import FontAwesome from '@expo/vector-icons/FontAwesome';
import { useState } from 'react';
import { Pressable, StyleSheet } from 'react-native';

import { NameInputModal } from '@/components/NameInputModal';
import { Text, View, useThemeColor } from '@/components/Themed';
import { useStore } from '@/store/useStore';

interface AddTaskButtonProps {
  parentId: string | null;
}

export function AddTaskButton({ parentId }: AddTaskButtonProps) {
  const [modalVisible, setModalVisible] = useState(false);
  const addTask = useStore((state) => state.addTask);
  const tintColor = useThemeColor({}, 'tint');

  const handleConfirm = (name: string) => {
    addTask({ name, parentId });
    setModalVisible(false);
  };

  return (
    <>
      <Pressable
        onPress={() => setModalVisible(true)}
        style={({ pressed }) => [styles.button, pressed && styles.buttonPressed]}
      >
        <FontAwesome name="plus-circle" size={20} color={tintColor} style={styles.icon} />
        <Text style={styles.buttonText}>タスクを追加</Text>
      </Pressable>
      <NameInputModal
        visible={modalVisible}
        title="新規タスク"
        placeholder="タスク名"
        onConfirm={handleConfirm}
        onCancel={() => setModalVisible(false)}
      />
    </>
  );
}

const styles = StyleSheet.create({
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    paddingHorizontal: 16,
    marginTop: 8,
  },
  buttonPressed: {
    opacity: 0.6,
  },
  icon: {
    marginRight: 8,
  },
  buttonText: {
    fontSize: 15,
  },
});
