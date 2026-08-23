"use client";

import { useEffect, useState } from "react";

export function useCollection<T>(fetch: () => Promise<T[]>): {
  data: T[] | null;
  loading: boolean;
  refresh: () => void;
} {
  const [data, setData] = useState<T[] | null>(null);
  const [loading, setLoading] = useState(true);

  async function load() {
    try {
      setData(await fetch());
    } catch {
      setData(null);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    // Initial data fetch on mount (intentional; setState happens after await)
    // eslint-disable-next-line react-hooks/set-state-in-effect
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return { data, loading, refresh: load };
}
