export const HOPEAI_MESSAGING_DRAFT_KEY =
  "sky4444.hopeai.launch.messaging.v1";
export const MAX_HOPEAI_LAUNCH_DRAFT_CHARS = 4_000;

type SessionStorageLike = Pick<Storage, "getItem" | "setItem" | "removeItem">;

const resolveSessionStorage = (
  storage?: SessionStorageLike
): SessionStorageLike | null => {
  if (storage) return storage;
  if (typeof window === "undefined") return null;
  try {
    return window.sessionStorage;
  } catch {
    return null;
  }
};

export const normalizeHopeAILaunchDraft = (value: string): string =>
  value.trim().slice(0, MAX_HOPEAI_LAUNCH_DRAFT_CHARS);

export function prepareMessagingHopeAILaunch(
  draft: string,
  storage?: SessionStorageLike
): boolean {
  const normalized = normalizeHopeAILaunchDraft(draft);
  const target = resolveSessionStorage(storage);
  if (!normalized || !target) return false;

  try {
    target.setItem(HOPEAI_MESSAGING_DRAFT_KEY, normalized);
    return true;
  } catch {
    return false;
  }
}

export function consumeMessagingHopeAILaunch(
  storage?: SessionStorageLike
): string {
  const target = resolveSessionStorage(storage);
  if (!target) return "";

  try {
    const raw = target.getItem(HOPEAI_MESSAGING_DRAFT_KEY) ?? "";
    target.removeItem(HOPEAI_MESSAGING_DRAFT_KEY);
    return normalizeHopeAILaunchDraft(raw);
  } catch {
    return "";
  }
}
