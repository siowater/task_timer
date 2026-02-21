/**
 * ルート画面（階層0）
 * ルート直下のカテゴリー・タスク一覧
 * @see docs/screen-list.md
 */

import { ScrollView, StyleSheet } from 'react-native';

import { AddCategoryButton } from '@/components/AddCategoryButton';
import { AddTaskButton } from '@/components/AddTaskButton';
import { CategoryList } from '@/components/CategoryList';
import { TaskList } from '@/components/TaskList';
import { Text, View } from '@/components/Themed';

export default function RootScreen() {
  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>カテゴリー</Text>
        <CategoryList parentId={null} />
        <AddCategoryButton parentId={null} level={1} />
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>タスク</Text>
        <TaskList parentId={null} />
        <AddTaskButton parentId={null} />
      </View>
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
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 8,
  },
});
