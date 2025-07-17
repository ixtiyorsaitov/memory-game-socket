import { useEffect, useState } from "react";

export function useLocalStorageWatcher<T>(key: string, initialValue: T) {
  const [value, setValue] = useState<T>(() => {
    const item = localStorage.getItem(key);
    return item ? JSON.parse(item) : initialValue;
  });

  useEffect(() => {
    const interval = setInterval(() => {
      const current = localStorage.getItem(key);
      const parsed = current ? JSON.parse(current) : initialValue;
      setValue((prev) => {
        if (JSON.stringify(prev) !== JSON.stringify(parsed)) {
          return parsed;
        }
        return prev;
      });
    }, 500); // har 500ms da tekshiradi

    return () => clearInterval(interval);
  }, [key]);

  return value;
}
