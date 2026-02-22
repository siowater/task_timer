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

jest.mock('react-native-draggable-flatlist', () => {
  const React = require('react');
  const { FlatList } = require('react-native');
  return {
    __esModule: true,
    default: (props) => React.createElement(FlatList, { ...props, scrollEnabled: true }),
    ScaleDecorator: ({ children }) => children,
    RenderItemParams: {},
  };
});
