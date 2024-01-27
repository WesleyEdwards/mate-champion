type KeyName = "token" | "high-score" | "dev-settings";

export const localStorageManager = {
  get: (key: KeyName) => {
    const value = localStorage.getItem(`mate-${key}`);
    if (value) {
      return JSON.parse(value);
    }
    return null;
  },
  set: (key: KeyName, value: any) => {
    localStorage.setItem(`mate-${key}`, JSON.stringify(value));
  },
  remove: (key: string) => {
    localStorage.removeItem(`mate-${key}`);
  },
};
