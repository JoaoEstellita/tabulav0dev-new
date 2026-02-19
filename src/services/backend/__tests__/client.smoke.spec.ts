import { beforeEach, describe, expect, it, vi } from 'vitest'

describe('backend client smoke', () => {
  beforeEach(() => {
    vi.resetModules()
    vi.restoreAllMocks()
    process.env.EXPO_PUBLIC_BACKEND_URL = 'https://example.com'
  })

  it('injects Bearer token when auth=true', async () => {
    vi.doMock('../../../config/firebase', () => ({
      auth: {
        currentUser: {
          getIdToken: vi.fn(async () => 'test-token'),
        },
      },
      getAppCheckToken: vi.fn(async () => null),
    }))

    const fetchMock = vi.fn(async () => ({ ok: true }))
    vi.stubGlobal('fetch', fetchMock as any)

    const { backendFetch } = await import('../client')

    await backendFetch('/api/status-refresh', {
      method: 'GET',
      auth: true,
      headers: { 'Content-Type': 'application/json' },
    })

    expect(fetchMock).toHaveBeenCalledTimes(1)
    const calls = fetchMock.mock.calls as any[]
    const call = calls[0]
    expect(call[0]).toBe('https://example.com/api/status-refresh')
    const headers = call[1].headers as Headers
    expect(headers.get('Authorization')).toBe('Bearer test-token')

    vi.unstubAllGlobals()
  })

  it('does not inject Bearer token when auth=false', async () => {
    vi.doMock('../../../config/firebase', () => ({
      auth: {
        currentUser: {
          getIdToken: vi.fn(async () => 'test-token'),
        },
      },
      getAppCheckToken: vi.fn(async () => null),
    }))

    const fetchMock = vi.fn(async () => ({ ok: true }))
    vi.stubGlobal('fetch', fetchMock as any)

    const { backendFetch } = await import('../client')

    await backendFetch('/api/status-policy', {
      method: 'GET',
      auth: false,
    })

    expect(fetchMock).toHaveBeenCalledTimes(1)
    const calls = fetchMock.mock.calls as any[]
    const headers = calls[0][1].headers as Headers
    expect(headers.get('Authorization')).toBeNull()

    vi.unstubAllGlobals()
  })

  it('injects App Check token when available', async () => {
    vi.doMock('../../../config/firebase', () => ({
      auth: { currentUser: null },
      getAppCheckToken: vi.fn(async () => 'appcheck-token'),
    }))

    const fetchMock = vi.fn(async () => ({ ok: true }))
    vi.stubGlobal('fetch', fetchMock as any)

    const { backendFetch } = await import('../client')

    await backendFetch('/api/status-policy', { method: 'GET' })

    expect(fetchMock).toHaveBeenCalledTimes(1)
    const headers = (fetchMock.mock.calls as any[])[0][1].headers as Headers
    expect(headers.get('X-Firebase-AppCheck')).toBe('appcheck-token')

    vi.unstubAllGlobals()
  })

  it('retries once with forced token refresh on stale session', async () => {
    const getIdToken = vi
      .fn(async (force?: boolean) => (force ? 'fresh-token' : 'stale-token'))

    vi.doMock('../../../config/firebase', () => ({
      auth: {
        currentUser: {
          getIdToken,
        },
      },
      getAppCheckToken: vi.fn(async () => null),
    }))

    const fetchMock = vi
      .fn()
      .mockResolvedValueOnce({
        ok: false,
        status: 401,
        clone: () => ({
          json: async () => ({ error: 'stale_session', reason: 'stale_auth_time' }),
        }),
      })
      .mockResolvedValueOnce({
        ok: true,
        status: 200,
      })

    vi.stubGlobal('fetch', fetchMock as any)

    const { backendFetch } = await import('../client')

    await backendFetch('/api/status-refresh', {
      method: 'POST',
      auth: true,
    })

    expect(fetchMock).toHaveBeenCalledTimes(2)
    expect(getIdToken).toHaveBeenCalledWith(true)
    const secondHeaders = (fetchMock.mock.calls as any[])[1][1].headers as Headers
    expect(secondHeaders.get('Authorization')).toBe('Bearer fresh-token')

    vi.unstubAllGlobals()
  })
})
