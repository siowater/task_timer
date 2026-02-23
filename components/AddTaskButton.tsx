/**
 * タスク追加ボタン
 * @see F-007
 */

import FontAwesome from '@expo/vector-icons/FontAwesome';
import { useState } from 'react';
import { StyleSheet, TouchableOpacity } from 'react-native';

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
      <TouchableOpacity
        onPress={() => setModalVisible(true)}
        style={styles.button}
        activeOpacity={0.6}
      >
        <FontAwesome name="plus-circle" size={20} color={tintColor} style={styles.icon} />
        <Text style={styles.buttonText}>タスクを追加</Text>
      </TouchableOpacity>
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
  icon: {
    marginRight: 8,
  },
  buttonText: {
    fontSize: 15,
  },
});
