/**
 * 稼働履歴画面のプレースホルダー
 * 詳細は後続タスクで実装
 * @see docs/screen-list.md
 */

import { StyleSheet } from 'react-native';

import { Text, View } from '@/components/Themed';

export default function HistoryScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>稼働履歴</Text>
      <Text style={styles.subtitle}>今日・今週の期間ビュー（未実装）</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  subtitle: {
    marginTop: 8,
    fontSize: 14,
    opacity: 0.7,
  },
});
