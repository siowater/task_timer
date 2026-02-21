/**
 * カテゴリー画面（Level 1〜4）
 * 子カテゴリー・タスク一覧を表示
 * @see docs/screen-list.md
 */

import { useLocalSearchParams } from 'expo-router';
import { ScrollView, StyleSheet } from 'react-native';

import { AddCategoryButton } from '@/components/AddCategoryButton';
import { AddTaskButton } from '@/components/AddTaskButton';
import { CategoryList } from '@/components/CategoryList';
import { TaskList } from '@/components/TaskList';
import { Text, View } from '@/components/Themed';
import { useStore } from '@/store/useStore';

export default function CategoryScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const parentId = id ?? null;
  const category = useStore((state) =>
    parentId ? state.categories.find((c) => c.id === parentId) : null
  );
  const childLevel = category
    ? (Math.min(category.level + 1, 4) as 1 | 2 | 3 | 4)
    : 1;

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      {category && (
        <Text style={styles.title}>{category.name}</Text>
      )}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>カテゴリー</Text>
        <CategoryList parentId={parentId} />
        <AddCategoryButton parentId={parentId} level={childLevel} />
      </View>
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>タスク</Text>
        <TaskList parentId={parentId} />
        <AddTaskButton parentId={parentId} />
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
  title: {
    fontSize: 20,
    fontWeight: '600',
    marginBottom: 16,
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
