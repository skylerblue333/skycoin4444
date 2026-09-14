export type DatingAction = 'like' | 'superlike' | 'pass';

export type FetchLike = (
  input: RequestInfo | URL,
  init?: RequestInit,
) => Promise<Response>;

export const MIN_DATING_AGE = 18;
export const MAX_DATING_AGE = 80;

export function clampAdultAge(value: number): number {
  if (!Number.isFinite(value)) return MIN_DATING_AGE;
  return Math.min(MAX_DATING_AGE, Math.max(MIN_DATING_AGE, Math.round(value)));
}

export function isAdultAge(value: unknown): value is number {
  return typeof value === 'number' && Number.isFinite(value) && value >= MIN_DATING_AGE;
}

async function readApiError(response: Response): Promise<string | null> {
  const contentType = response.headers.get('content-type') ?? '';

  try {
    if (contentType.includes('application/json')) {
      const body = (await response.json()) as { message?: unknown; error?: unknown };
      const candidate = typeof body.message === 'string' ? body.message : body.error;
      return typeof candidate === 'string' && candidate.trim() ? candidate.trim() : null;
    }

    const text = (await response.text()).trim();
    return text || null;
  } catch {
    return null;
  }
}

export async function submitDatingAction(
  fetcher: FetchLike,
  profileId: string,
  action: DatingAction,
): Promise<void> {
  const toUserId = profileId.trim();
  if (!toUserId) throw new Error('A valid profile is required.');

  const response = await fetcher('/api/dating/like', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ toUserId, likeType: action }),
  });

  if (!response.ok) {
    const detail = await readApiError(response);
    throw new Error(detail ?? `Dating action failed (${response.status}). Please try again.`);
  }
}
