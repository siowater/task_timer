/**
 * カテゴリー一覧コンポーネント
 * @see F-001, F-004
 */

import FontAwesome from '@expo/vector-icons/FontAwesome';
import { useRouter } from 'expo-router';
import { Pressable, StyleSheet } from 'react-native';

import { Text, View, useThemeColor } from '@/components/Themed';
import { useStore } from '@/store/useStore';
import type { Category } from '@/types';

interface CategoryListProps {
  /** 親カテゴリーID。null の場合はルート直下 */
  parentId: string | null;
}

function sortByOrder<T extends { order: number }>(items: T[]): T[] {
  return [...items].sort((a, b) => a.order - b.order);
}

export function CategoryList({ parentId }: CategoryListProps) {
  const router = useRouter();
  const iconColor = useThemeColor({}, 'text');
  const categories = useStore((state) =>
    sortByOrder(state.categories.filter((c) => c.parentId === parentId))
  );

  const handlePress = (category: Category) => {
    router.push(`/category/${category.id}`);
  };

  if (categories.length === 0) {
    return (
      <View style={styles.empty} lightColor="#f5f5f5" darkColor="#1a1a1a">
        <Text style={styles.emptyText}>カテゴリーがありません</Text>
      </View>
    );
  }

  return (
    <View style={styles.list}>
      {categories.map((category) => (
        <Pressable
          key={category.id}
          onPress={() => handlePress(category)}
          style={({ pressed }) => [styles.item, pressed && styles.itemPressed]}
        >
          <FontAwesome name="folder" size={18} color={iconColor} style={styles.icon} />
          <Text style={styles.itemText}>{category.name}</Text>
          <FontAwesome name="chevron-right" size={14} color={iconColor} style={styles.chevron} />
        </Pressable>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  list: {
    borderRadius: 8,
    overflow: 'hidden',
  },
  item: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 16,
  },
  itemPressed: {
    opacity: 0.6,
  },
  icon: {
    marginRight: 12,
    opacity: 0.7,
  },
  itemText: {
    flex: 1,
    fontSize: 16,
  },
  chevron: {
    opacity: 0.5,
  },
  empty: {
    minHeight: 80,
    borderRadius: 8,
    padding: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyText: {
    fontSize: 14,
    opacity: 0.7,
  },
});
