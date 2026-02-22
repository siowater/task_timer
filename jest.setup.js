/**
 * Jest セットアップ
 * @see T-024-1 (#87) Toast モック
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
