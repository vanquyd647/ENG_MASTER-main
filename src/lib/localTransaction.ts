// All values are prepared before the first write. Restore the old keys on failure.
export const writeLocalChanges = (changes: Record<string, string | null>) => {
  const before = Object.fromEntries(Object.keys(changes).map((key) => [key, localStorage.getItem(key)]));
  try {
    for (const [key, value] of Object.entries(changes)) {
      if (value === null) localStorage.removeItem(key);
      else localStorage.setItem(key, value);
    }
  } catch (error) {
    // Free space occupied by partially written values before restoring larger old values.
    for (const key of Object.keys(before)) localStorage.removeItem(key);
    for (const [key, value] of Object.entries(before)) {
      if (value === null) localStorage.removeItem(key);
      else localStorage.setItem(key, value);
    }
    throw error;
  }
};
