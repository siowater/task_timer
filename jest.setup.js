/**
 * Jest セットアップ
 * @see T-024-1 (#87) Toast モック
 * @see T-025-1 (#82) DraggableFlatList モック
 */
jest.mock('expo-react-native-toastify', () => ({
  __esModule: true,
  default: () => null,
  Toast: {
    error: jest.fn(),
    info: jest.fn(),
    success: jest.fn(),
  },
}));

jest.mock('react-native-draglist', () => {
  const React = require('react');
  const { FlatList } = require('react-native');
  return {
    __esModule: true,
    default: (props) => {
      const { renderItem, data, keyExtractor, onReordered, ...rest } = props;
      const wrappedRenderItem = ({ item, index }: { item: unknown; index: number }) =>
        renderItem({
          item,
          index,
          onDragStart: () => {},
          onDragEnd: () => {},
          isActive: false,
        });
      return React.createElement(FlatList, {
        ...rest,
        data,
        keyExtractor,
        renderItem: wrappedRenderItem,
        scrollEnabled: true,
      });
    },
  };
});
