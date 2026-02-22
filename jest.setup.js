/**
 * Jest セットアップ
 * @see T-024-1 (#87) Toast モック
 */
const mockShow = jest.fn();
const mockHide = jest.fn();
jest.mock('react-native-toast-message', () => {
  const MockComponent = () => null;
  MockComponent.show = mockShow;
  MockComponent.hide = mockHide;
  return { __esModule: true, default: MockComponent };
});
