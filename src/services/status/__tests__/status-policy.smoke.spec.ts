import { beforeEach, describe, expect, it, vi } from 'vitest'

process.env.EXPO_PUBLIC_BACKEND_URL = 'https://example.com'

describe('StatusPolicyService smoke', () => {
  beforeEach(() => {
    vi.resetModules()
    vi.restoreAllMocks()
  })

  it('loads policy once per session and caches result', async () => {
    const cache = new Map<string, string>()
    const applyRuntimeStatusThresholds = vi.fn()

    vi.doMock('@react-native-async-storage/async-storage', () => ({
      default: {
        getItem: vi.fn(async (key: string) => cache.get(key) ?? null),
        setItem: vi.fn(async (key: string, value: string) => {
          cache.set(key, value)
        }),
      },
    }))

    vi.doMock('../../../constants/statusThresholds', () => ({
      applyRuntimeStatusThresholds,
    }))

    const fetchMock = vi.fn(async () => ({
      ok: true,
      json: async () => ({
        ok: true,
        policyVersion: 'status-backend-test',
        thresholds: { criticalBelow: 35, positiveAbove: 62 },
      }),
    }))

    vi.stubGlobal('fetch', fetchMock as any)

    const { ensureStatusPolicyLoaded } = await import('../StatusPolicyService')

    await ensureStatusPolicyLoaded()
    await ensureStatusPolicyLoaded()

    expect(fetchMock).toHaveBeenCalledTimes(1)
    expect(applyRuntimeStatusThresholds).toHaveBeenCalledTimes(1)
    expect(cache.size).toBe(1)

    vi.unstubAllGlobals()
  })

  it('uses cached policy and skips remote fetch', async () => {
    const now = 1700000000000
    vi.spyOn(Date, 'now').mockReturnValue(now)

    const cachedPayload = {
      fetchedAt: now,
      payload: {
        ok: true,
        policyVersion: 'status-backend-cached',
        thresholds: { criticalBelow: 35, positiveAbove: 62 },
      },
    }

    const applyRuntimeStatusThresholds = vi.fn()
    const fetchMock = vi.fn()

    vi.doMock('@react-native-async-storage/async-storage', () => ({
      default: {
        getItem: vi.fn(async () => JSON.stringify(cachedPayload)),
        setItem: vi.fn(async () => undefined),
      },
    }))

    vi.doMock('../../../constants/statusThresholds', () => ({
      applyRuntimeStatusThresholds,
    }))

    vi.stubGlobal('fetch', fetchMock as any)

    const { ensureStatusPolicyLoaded } = await import('../StatusPolicyService')
    await ensureStatusPolicyLoaded()

    expect(fetchMock).not.toHaveBeenCalled()
    expect(applyRuntimeStatusThresholds).toHaveBeenCalledTimes(1)

    vi.unstubAllGlobals()
  })
})
