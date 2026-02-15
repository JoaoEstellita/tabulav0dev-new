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
})
