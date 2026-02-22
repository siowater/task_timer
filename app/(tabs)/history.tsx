/**
 * 稼働履歴画面
 * 今日・今週のセッションログ一覧
 * @see T-021-1 (#77), T-021-2 (#79), T-021-3 (#71)
 * @see T-022-1 (#80) 手動入力モーダルへの導線
 */

import FontAwesome from '@expo/vector-icons/FontAwesome';
import { useRouter } from 'expo-router';
import { Pressable, ScrollView, StyleSheet } from 'react-native';

import { SessionLogList } from '@/components/SessionLogList';
import { Text, View, useThemeColor } from '@/components/Themed';
import { getTodayDateString, getThisWeekDateStrings } from '@/utils/dateHelpers';

export default function HistoryScreen() {
  const router = useRouter();
  const tintColor = useThemeColor({}, 'tint');
  const today = getTodayDateString();
  const weekDates = getThisWeekDateStrings();

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <View style={styles.header}>
        <Text style={styles.title}>稼働履歴</Text>
        <Pressable
          onPress={() => router.push('/modal')}
          style={({ pressed }) => [
            styles.addButton,
            { borderColor: tintColor },
            pressed && { opacity: 0.7 },
          ]}
        >
          <FontAwesome name="plus" size={16} color={tintColor} />
          <Text style={[styles.addButtonText, { color: tintColor }]}>手動入力</Text>
        </Pressable>
      </View>

      <SessionLogList
        dateStrings={[today]}
        title="今日"
      />

      <SessionLogList
        dateStrings={weekDates}
        title="今週"
      />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    padding: 16,
    paddingBottom: 32,
  },
  header: {
    marginBottom: 20,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  addButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 8,
    borderWidth: 1,
  },
  addButtonText: {
    fontSize: 14,
    fontWeight: '500',
  },
});
