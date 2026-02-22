/**
 * カテゴリー一覧コンポーネント
 * D&D で並び替え可能
 * @see F-001, F-004, T-025-2 (#85)
 */

import FontAwesome from '@expo/vector-icons/FontAwesome';
import { useRouter } from 'expo-router';
import { Pressable, StyleSheet } from 'react-native';
import DragList, { DragListRenderItemInfo } from 'react-native-draglist';

import { Text, View, useThemeColor } from '@/components/Themed';
import { useStore } from '@/store/useStore';
import { getCategoriesByParentId } from '@/store/selectors';
import type { Category } from '@/types';

interface CategoryListProps {
  /** 親カテゴリーID。null の場合はルート直下 */
  parentId: string | null;
}

export function CategoryList({ parentId }: CategoryListProps) {
  const router = useRouter();
  const iconColor = useThemeColor({}, 'text');
  const categories = useStore((state) =>
    getCategoriesByParentId(state.categories, parentId)
  );
  const reorderCategory = useStore((state) => state.reorderCategory);

  const handlePress = (category: Category) => {
    router.push(`/category/${category.id}`);
  };

  const onReordered = (fromIndex: number, toIndex: number) => {
    if (fromIndex >= 0 && fromIndex < categories.length && toIndex >= 0 && toIndex < categories.length) {
      reorderCategory(categories[fromIndex].id, toIndex);
    }
  };

  const renderItem = ({ item, onDragStart, onDragEnd, isActive }: DragListRenderItemInfo<Category>) => (
    <View style={[styles.item, isActive && styles.itemPressed]}>
      <Pressable onPressIn={onDragStart} onPressOut={onDragEnd} style={styles.dragHandle}>
        <FontAwesome name="bars" size={16} color={iconColor} />
      </Pressable>
      <Pressable
        onPress={() => handlePress(item)}
        style={({ pressed }) => [styles.itemContent, pressed && styles.itemPressed]}
      >
        <FontAwesome name="folder" size={18} color={iconColor} style={styles.icon} />
        <Text style={styles.itemText}>{item.name}</Text>
        <FontAwesome name="chevron-right" size={14} color={iconColor} style={styles.chevron} />
      </Pressable>
    </View>
  );

  if (categories.length === 0) {
    return (
      <View style={styles.empty} lightColor="#f5f5f5" darkColor="#1a1a1a">
        <Text style={styles.emptyText}>カテゴリーがありません</Text>
      </View>
    );
  }

  return (
    <DragList
      data={categories}
      keyExtractor={(item) => item.id}
      renderItem={renderItem}
      onReordered={onReordered}
      style={styles.list}
    />
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
  itemContent: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
  },
  dragHandle: {
    marginRight: 12,
    opacity: 0.5,
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
