import { useCallback, useEffect, useMemo, useState } from "react";
import { useAuth } from "@/_core/hooks/useAuth";
import { trpc } from "@/lib/trpc";
import {
  loadArcadePassport,
  mergeArcadeProgress,
  normalizeArcadeRun,
  recordArcadeRunToStorage,
  saveArcadePassport,
  toggleArcadeFavoriteInStorage,
  type ArcadeGameId,
  type ArcadePassport,
  type RecordableArcadeRun,
} from "@/lib/arcadePassport";

export function useArcadePassportSync() {
  const { isAuthenticated } = useAuth();
  const [localPassport, setLocalPassport] = useState<ArcadePassport>(() =>
    loadArcadePassport()
  );
  const server = trpc.arcadeProgress.list.useQuery(undefined, {
    enabled: isAuthenticated,
    retry: false,
  });

  const passport = useMemo(
    () =>
      server.data
        ? mergeArcadeProgress(localPassport, server.data)
        : localPassport,
    [localPassport, server.data]
  );

  useEffect(() => {
    if (!server.data) return;
    saveArcadePassport(passport);
  }, [passport, server.data]);

  const refresh = useCallback(async () => {
    setLocalPassport(loadArcadePassport());
    if (isAuthenticated) {
      await server.refetch();
    }
  }, [isAuthenticated, server]);

  const toggleFavorite = useCallback((gameId: ArcadeGameId) => {
    setLocalPassport(toggleArcadeFavoriteInStorage(gameId));
  }, []);

  return {
    passport,
    isAuthenticated,
    syncStatus: !isAuthenticated
      ? ("local_only" as const)
      : server.isError
        ? ("error" as const)
        : server.isFetching
          ? ("syncing" as const)
          : ("synced" as const),
    syncError: server.error,
    refresh,
    toggleFavorite,
  };
}

export function useArcadeRunRecorder() {
  const { isAuthenticated } = useAuth();
  const utils = trpc.useUtils();
  const mutation = trpc.arcadeProgress.record.useMutation({
    onSuccess: async () => {
      await utils.arcadeProgress.list.invalidate();
    },
  });

  const recordRun = useCallback(
    (run: RecordableArcadeRun) => {
      const normalized = normalizeArcadeRun(run);
      const passport = recordArcadeRunToStorage({
        ...normalized,
        completedAt: run.completedAt,
      });

      if (isAuthenticated) {
        mutation.mutate({
          ...normalized,
          gameId: run.gameId,
        });
      }

      return passport;
    },
    [isAuthenticated, mutation]
  );

  return {
    recordRun,
    serverSyncPending: mutation.isPending,
    serverSyncError: mutation.error,
    serverSyncEnabled: isAuthenticated,
  };
}
