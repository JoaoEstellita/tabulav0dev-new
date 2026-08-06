import { beforeEach, describe, expect, it, vi } from 'vitest'

import {
  lerComCache,
  guardarNoCache,
  invalidarCache,
  chaveUsuario,
  chaveStatusUsuario,
} from '../docCache'

describe('docCache', () => {
  beforeEach(() => {
    invalidarCache()
    vi.useRealTimers()
  })

  it('le uma vez e serve o resto do TTL a partir do cache', async () => {
    const carregar = vi.fn(async () => ({ nome: 'João' }))

    const primeira = await lerComCache('users:abc', 60_000, carregar)
    const segunda = await lerComCache('users:abc', 60_000, carregar)

    expect(carregar).toHaveBeenCalledTimes(1)
    expect(segunda).toBe(primeira)
  })

  // O ganho principal: oito telas montando juntas nao abrem oito leituras.
  it('deduplica chamadas concorrentes na mesma chave', async () => {
    let resolver: ((valor: unknown) => void) | null = null
    const carregar = vi.fn(
      () =>
        new Promise((resolve) => {
          resolver = resolve
        })
    )

    const emParalelo = Promise.all([
      lerComCache('userStatus:abc', 60_000, carregar as any),
      lerComCache('userStatus:abc', 60_000, carregar as any),
      lerComCache('userStatus:abc', 60_000, carregar as any),
    ])

    expect(carregar).toHaveBeenCalledTimes(1)
    resolver!({ score: 72 })

    const [a, b, c] = await emParalelo
    expect(a).toEqual({ score: 72 })
    expect(b).toBe(a)
    expect(c).toBe(a)
  })

  it('recarrega depois que o TTL expira', async () => {
    vi.useFakeTimers()
    const carregar = vi.fn(async () => Date.now())

    await lerComCache('users:abc', 1_000, carregar)
    vi.advanceTimersByTime(1_500)
    await lerComCache('users:abc', 1_000, carregar)

    expect(carregar).toHaveBeenCalledTimes(2)
  })

  it('forcar ignora o que estiver guardado', async () => {
    const carregar = vi.fn(async () => 'valor')

    await lerComCache('users:abc', 60_000, carregar)
    await lerComCache('users:abc', 60_000, carregar, { forcar: true })

    expect(carregar).toHaveBeenCalledTimes(2)
  })

  it('invalida por prefixo sem derrubar as outras chaves', async () => {
    const perfil = vi.fn(async () => 'perfil')
    const status = vi.fn(async () => 'status')

    await lerComCache(chaveUsuario('abc'), 60_000, perfil)
    await lerComCache(chaveStatusUsuario('abc'), 60_000, status)

    invalidarCache(chaveUsuario('abc'))

    await lerComCache(chaveUsuario('abc'), 60_000, perfil)
    await lerComCache(chaveStatusUsuario('abc'), 60_000, status)

    expect(perfil).toHaveBeenCalledTimes(2)
    expect(status).toHaveBeenCalledTimes(1)
  })

  it('guardarNoCache evita a leitura seguinte', async () => {
    const carregar = vi.fn(async () => 'do firestore')

    guardarNoCache(chaveStatusUsuario('abc'), 'do backend', 60_000)
    const valor = await lerComCache(chaveStatusUsuario('abc'), 60_000, carregar)

    expect(valor).toBe('do backend')
    expect(carregar).not.toHaveBeenCalled()
  })

  it('invalidarCache() sem prefixo limpa tudo — o caso do logout', async () => {
    const carregar = vi.fn(async () => 'x')

    await lerComCache(chaveUsuario('abc'), 60_000, carregar)
    invalidarCache()
    await lerComCache(chaveUsuario('abc'), 60_000, carregar)

    expect(carregar).toHaveBeenCalledTimes(2)
  })

  it('falha nao fica grudada no cache', async () => {
    const carregar = vi
      .fn()
      .mockRejectedValueOnce(new Error('offline'))
      .mockResolvedValueOnce('ok')

    await expect(lerComCache('users:abc', 60_000, carregar)).rejects.toThrow('offline')
    await expect(lerComCache('users:abc', 60_000, carregar)).resolves.toBe('ok')
  })
})
