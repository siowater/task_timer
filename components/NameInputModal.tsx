/**
 * 名前入力モーダル
 * カテゴリー・タスク作成時に使用
 */

import { useState } from 'react';
import {
  Modal,
  Pressable,
  StyleSheet,
  TextInput,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';

import { Text, View, useThemeColor } from '@/components/Themed';

interface NameInputModalProps {
  visible: boolean;
  title: string;
  placeholder?: string;
  onConfirm: (name: string) => void;
  onCancel: () => void;
}

export function NameInputModal({
  visible,
  title,
  placeholder = '名前を入力',
  onConfirm,
  onCancel,
}: NameInputModalProps) {
  const [name, setName] = useState('');
  const tintColor = useThemeColor({}, 'tint');

  const handleConfirm = () => {
    const trimmed = name.trim();
    if (trimmed) {
      onConfirm(trimmed);
      setName('');
    }
  };

  const handleCancel = () => {
    setName('');
    onCancel();
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={handleCancel}
    >
      <Pressable style={styles.overlay} onPress={handleCancel}>
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          style={styles.centered}
        >
          <Pressable onPress={(e) => e.stopPropagation()}>
            <View style={styles.modal}>
              <Text style={styles.title}>{title}</Text>
              <TextInput
                style={styles.input}
                placeholder={placeholder}
                placeholderTextColor="#999"
                value={name}
                onChangeText={setName}
                autoFocus
                autoCapitalize="none"
                autoCorrect={false}
              />
              <View style={styles.buttons}>
                <Pressable
                  style={[styles.button, styles.cancelButton]}
                  onPress={handleCancel}
                >
                  <Text style={styles.cancelButtonText}>キャンセル</Text>
                </Pressable>
                <Pressable
                  style={[styles.button, { backgroundColor: tintColor }]}
                  onPress={handleConfirm}
                >
                  <Text style={styles.confirmButtonText}>追加</Text>
                </Pressable>
              </View>
            </View>
          </Pressable>
        </KeyboardAvoidingView>
      </Pressable>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  centered: {
    width: '100%',
    maxWidth: 320,
  },
  modal: {
    borderRadius: 12,
    padding: 20,
  },
  title: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 16,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 16,
    marginBottom: 16,
  },
  buttons: {
    flexDirection: 'row',
    gap: 12,
    justifyContent: 'flex-end',
  },
  button: {
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 8,
  },
  cancelButton: {},
  cancelButtonText: {
    fontSize: 16,
    opacity: 0.8,
  },
  confirmButtonText: {
    fontSize: 16,
    color: '#fff',
    fontWeight: '600',
  },
});
