import { useState, useEffect, useCallback } from "react";
import { api } from "@/services/api";
import type { CVFile } from "@/types/cv";

export function useRecentUploads() {
  const [uploads, setUploads] = useState<CVFile[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchUploads = useCallback(() => {
    let cancelled = false;

    api
      .getRecentUploads()
      .then((result) => {
        if (!cancelled) setUploads(result);
      })
      .catch((e) => {
        if (!cancelled) setError(e.message);
      })
      .finally(() => {
        if (!cancelled) setIsLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    const cleanup = fetchUploads();
    return cleanup;
  }, [fetchUploads]);

  return { uploads, isLoading, error, refetch: fetchUploads };
}