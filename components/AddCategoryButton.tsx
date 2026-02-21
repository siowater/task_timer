/**
 * カテゴリー追加ボタン
 * @see F-002, T-011-3 で Level 4 時は非表示
 */

import FontAwesome from '@expo/vector-icons/FontAwesome';
import { useState } from 'react';
import { Pressable, StyleSheet } from 'react-native';

import { NameInputModal } from '@/components/NameInputModal';
import { Text, View, useThemeColor } from '@/components/Themed';
import { useStore } from '@/store/useStore';
import { MAX_CATEGORY_LEVEL } from '@/constants/app';

interface AddCategoryButtonProps {
  parentId: string | null;
  level: 1 | 2 | 3 | 4;
}

export function AddCategoryButton({ parentId, level }: AddCategoryButtonProps) {
  const [modalVisible, setModalVisible] = useState(false);
  const addCategory = useStore((state) => state.addCategory);
  const tintColor = useThemeColor({}, 'tint');

  if (level === MAX_CATEGORY_LEVEL) {
    return null;
  }

  const handleConfirm = (name: string) => {
    addCategory({ name, parentId, level });
    setModalVisible(false);
  };

  return (
    <>
      <Pressable
        onPress={() => setModalVisible(true)}
        style={({ pressed }) => [styles.button, pressed && styles.buttonPressed]}
      >
        <FontAwesome name="plus-circle" size={20} color={tintColor} style={styles.icon} />
        <Text style={styles.buttonText}>カテゴリーを追加</Text>
      </Pressable>
      <NameInputModal
        visible={modalVisible}
        title="新規カテゴリー"
        placeholder="カテゴリー名"
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
