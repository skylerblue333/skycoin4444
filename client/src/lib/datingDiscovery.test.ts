import { describe, expect, it, vi } from 'vitest';
import {
  clampAdultAge,
  isAdultAge,
  submitDatingAction,
} from './datingDiscovery';

describe('dating discovery helpers', () => {
  it('clamps age filters to the supported adult range', () => {
    expect(clampAdultAge(16)).toBe(18);
    expect(clampAdultAge(34)).toBe(34);
    expect(clampAdultAge(120)).toBe(80);
    expect(clampAdultAge(Number.NaN)).toBe(18);
  });

  it('rejects underage and invalid profile ages', () => {
    expect(isAdultAge(18)).toBe(true);
    expect(isAdultAge(42)).toBe(true);
    expect(isAdultAge(17)).toBe(false);
    expect(isAdultAge('21')).toBe(false);
    expect(isAdultAge(Number.NaN)).toBe(false);
  });

  it('submits a like using the expected API contract', async () => {
    const fetcher = vi.fn(async () => new Response(null, { status: 204 }));

    await submitDatingAction(fetcher, 'profile-42', 'like');

    expect(fetcher).toHaveBeenCalledTimes(1);
    expect(fetcher).toHaveBeenCalledWith('/api/dating/like', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ toUserId: 'profile-42', likeType: 'like' }),
    });
  });

  it('surfaces API errors and does not report failed actions as success', async () => {
    const fetcher = vi.fn(async () => new Response(
      JSON.stringify({ message: 'Profile is no longer available.' }),
      { status: 409, headers: { 'content-type': 'application/json' } },
    ));

    await expect(submitDatingAction(fetcher, 'profile-42', 'pass'))
      .rejects.toThrow('Profile is no longer available.');
  });

  it('rejects empty profile ids before making a request', async () => {
    const fetcher = vi.fn();

    await expect(submitDatingAction(fetcher, '   ', 'superlike'))
      .rejects.toThrow('A valid profile is required.');
    expect(fetcher).not.toHaveBeenCalled();
  });
});
