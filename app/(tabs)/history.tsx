/**
 * 稼働履歴画面
 * 今日・今週のセッションログ一覧
 * @see T-021-1 (#77), T-021-2 (#79), T-021-3 (#71)
 */

import { ScrollView, StyleSheet } from 'react-native';

import { SessionLogList } from '@/components/SessionLogList';
import { Text, View } from '@/components/Themed';
import { getTodayDateString, getThisWeekDateStrings } from '@/utils/dateHelpers';

export default function HistoryScreen() {
  const today = getTodayDateString();
  const weekDates = getThisWeekDateStrings();

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <View style={styles.header}>
        <Text style={styles.title}>稼働履歴</Text>
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
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
  },
});
