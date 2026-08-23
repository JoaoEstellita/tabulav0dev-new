import { describe, expect, it } from 'vitest'
import { connectionId } from '../connectionsModel'

describe('connectionId (frontend, espelha o backend)', () => {
  it('ordena os uids — mesma dupla, mesmo id', () => {
    expect(connectionId('bbb', 'aaa')).toBe('aaa_bbb')
    expect(connectionId('aaa', 'bbb')).toBe('aaa_bbb')
  })
  it('null p/ mesma pessoa ou vazio', () => {
    expect(connectionId('aaa', 'aaa')).toBeNull()
    expect(connectionId('', 'bbb')).toBeNull()
    expect(connectionId('aaa', '')).toBeNull()
  })
})
