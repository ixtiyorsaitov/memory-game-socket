import { useEffect, useState } from "react";

export function useLocalStorageWatcher<T>(key: string, initialValue: T) {
  const [value, setValue] = useState<T>(() => {
    const item = localStorage.getItem(key);
    try {
      return item ? JSON.parse(item) : initialValue;
    } catch (err) {
      return item as unknown as T; // fallback
    }
  });

  useEffect(() => {
    const interval = setInterval(() => {
      const current = localStorage.getItem(key);
      try {
        const parsed = current ? JSON.parse(current) : initialValue;
        setValue((prev) => {
          if (JSON.stringify(prev) !== JSON.stringify(parsed)) {
            return parsed;
          }
          return prev;
        });
      } catch (err) {
        if (current && current !== value) {
          setValue(current as unknown as T);
        }
      }
    }, 500);

    return () => clearInterval(interval);
  }, [key]);

  return value;
}
