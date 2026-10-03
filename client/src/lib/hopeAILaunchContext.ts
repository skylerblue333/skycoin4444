export const HOPEAI_MESSAGING_DRAFT_KEY = "sky4444.hopeai.launch.messaging.v1";
export const HOPEAI_MESSAGING_RETURN_KEY = "sky4444.hopeai.return.messaging.v1";
export const MAX_HOPEAI_LAUNCH_DRAFT_CHARS = 4_000;

export type HopeAIMessagingReturnPreparation =
  "prepared" | "empty" | "too_large" | "storage_unavailable";

export type HopeAIMessagingReturn =
  | Readonly<{ status: "restored"; draft: string }>
  | Readonly<{
      status: "empty" | "invalid" | "storage_unavailable";
      draft: "";
    }>;

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

export function prepareHopeAIMessagingReturn(
  draft: string,
  storage?: SessionStorageLike
): HopeAIMessagingReturnPreparation {
  const normalized = draft.trim();
  const target = resolveSessionStorage(storage);
  if (!target) return "storage_unavailable";

  try {
    // A new handoff attempt always invalidates any older, unconsumed output.
    target.removeItem(HOPEAI_MESSAGING_RETURN_KEY);
    if (!normalized) return "empty";
    if (normalized.length > MAX_HOPEAI_LAUNCH_DRAFT_CHARS) {
      return "too_large";
    }
    target.setItem(HOPEAI_MESSAGING_RETURN_KEY, normalized);
    return "prepared";
  } catch {
    return "storage_unavailable";
  }
}

export function consumeHopeAIMessagingReturn(
  storage?: SessionStorageLike
): HopeAIMessagingReturn {
  const target = resolveSessionStorage(storage);
  if (!target) return { status: "storage_unavailable", draft: "" };

  try {
    const raw = target.getItem(HOPEAI_MESSAGING_RETURN_KEY);
    target.removeItem(HOPEAI_MESSAGING_RETURN_KEY);
    if (raw === null) return { status: "empty", draft: "" };

    const normalized = raw.trim();
    if (!normalized || normalized.length > MAX_HOPEAI_LAUNCH_DRAFT_CHARS) {
      return { status: "invalid", draft: "" };
    }

    return { status: "restored", draft: normalized };
  } catch {
    return { status: "storage_unavailable", draft: "" };
  }
}
