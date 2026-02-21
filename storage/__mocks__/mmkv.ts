export const storage = {
  set: jest.fn(),
  getString: jest.fn((_name: string) => undefined),
  remove: jest.fn(),
};

export const zustandStorage = {
  getItem: (name: string) => {
    const value = storage.getString(name) as string | undefined;
    return value ?? null;
  },
  setItem: (name: string, value: string) => {
    storage.set(name, value);
  },
  removeItem: (name: string) => {
    storage.remove(name);
  },
};
