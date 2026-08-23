# Conexões Astrológicas — Fase 1 (MVP) — Plano de Implementação

**Goal:** Permitir que dois usuários que dividem um grupo se conectem (pedido→aceite), troquem WhatsApp por duplo consentimento no mesmo fluxo, vejam suas conexões numa lista persistente, e possam bloquear/denunciar.

**Arquitetura:** Uma collection Firestore `connections/{id}` (id determinístico pelos 2 uids ordenados) guarda o vínculo e quem liberou o WhatsApp. Um handler backend (`api/[...slug].js` → `lib/api-handlers/connections.js`) faz as mutações com validação de auth e resolve o WhatsApp do outro **só** quando ambos liberaram — o número nunca fica cru no doc. O frontend ganha um botão "Conectar" na matriz de sinastria que já existe no `GroupsScreen` e uma tela "Minhas Conexões". Notificação do pedido reusa o pipeline de push + espelho do agente.

**Stack:** Node (Vercel serverless, CommonJS), firebase-admin, Firestore rules; React Native/Expo + TypeScript; testes `tests/*.unit.js` (backend, node assert) e Vitest (frontend).

**Spec:** `frontend/docs/superpowers/specs/2026-08-22-conexoes-astrologicas-design.md`

---

## Mapa de arquivos

**Backend (repo `backend/`)**
- Criar: `lib/connections/model.js` — id determinístico, shape do doc, helpers puros (testável sem Firestore).
- Criar: `lib/api-handlers/connections.js` — handler das ações (request/respond/list/block/report/share-wa).
- Modificar: `api/[...slug].js` — registrar o handler `connections`.
- Criar: `tests/connections.unit.js` — testes das funções puras + do fluxo do handler (com Firestore mockado).

**Rules (repo `frontend/`)**
- Modificar: `frontend/firebase-rules-production.rules` e `firebase-rules-secure.rules` — bloco `match /connections/{id}`.

**Frontend (repo `frontend/`)**
- Criar: `src/services/ConnectionsService.ts` — chamadas ao backend + tipos.
- Modificar: `src/screens/groups/GroupsScreen.tsx` — botão "Conectar" por membro na matriz.
- Criar: `src/screens/connections/ConnectionsScreen.tsx` — lista (pending recebido/enviado, aceitas, bloqueadas) + ações.
- Modificar: `src/navigation/AppNavigator.tsx` — rota `Connections`.
- Modificar: `src/i18n/appI18n.ts` — strings `connections.*` (4 idiomas).
- Criar: `src/services/__tests__/connectionsModel.spec.ts` — id determinístico + regra do WhatsApp (função pura espelhada).

---

## Task 1: Modelo de dados puro (backend)

**Arquivos:**
- Criar: `backend/lib/connections/model.js`
- Teste: `backend/tests/connections.unit.js`

- [ ] **Step 1: Escreva o teste que falha**

```js
'use strict'
const assert = require('assert')
const m = require('../lib/connections/model')
let passed = 0
const eq = (a, b, msg) => { assert.strictEqual(a, b, msg); passed++ }
const ok = (c, msg) => { assert.ok(c, msg); passed++ }

// id determinístico: mesma dupla → mesmo id, independente da ordem
eq(m.connectionId('bbb', 'aaa'), 'aaa_bbb', 'id ordena os uids')
eq(m.connectionId('aaa', 'bbb'), 'aaa_bbb', 'id igual invertendo a ordem')
eq(m.connectionId('aaa', 'aaa'), null, 'nao conecta consigo mesmo')

// shape do pedido inicial
const req = m.buildRequest({ from: 'aaa', to: 'bbb', originGroupId: 'g1', shareWhatsapp: true })
eq(req.status, 'pending', 'nasce pending')
eq(req.requestedBy, 'aaa', 'guarda quem pediu')
assert.deepStrictEqual(req.participants.slice().sort(), ['aaa', 'bbb'], 'participantes')
assert.deepStrictEqual(req.whatsappSharedBy, ['aaa'], 'quem pediu ja liberou o WA se marcou')
eq(m.buildRequest({ from: 'aaa', to: 'bbb', shareWhatsapp: false }).whatsappSharedBy.length, 0, 'sem WA se nao marcou')

// regra do WhatsApp: só revela quando os DOIS liberaram
eq(m.whatsappMutuallyShared({ whatsappSharedBy: ['aaa'] }, 'aaa', 'bbb'), false, 'so um liberou -> nao revela')
eq(m.whatsappMutuallyShared({ whatsappSharedBy: ['aaa', 'bbb'] }, 'aaa', 'bbb'), true, 'ambos -> revela')

console.log(`connections.unit: ok (${passed} asserções)`)
```

- [ ] **Step 2: Rode e confirme que falha**

Comando: `cd backend && node tests/connections.unit.js`
Esperado: FAIL `Cannot find module '../lib/connections/model'`.

- [ ] **Step 3: Implemente o model**

```js
'use strict'
// Funções PURAS do modelo de conexões — sem Firestore, testáveis direto.

/** id determinístico da dupla (uids ordenados). null se for a mesma pessoa. */
function connectionId(a, b) {
  if (!a || !b || a === b) return null
  return [String(a), String(b)].sort().join('_')
}

/** Doc inicial de um pedido de conexão. */
function buildRequest({ from, to, originGroupId = null, shareWhatsapp = false }) {
  return {
    participants: [String(from), String(to)].sort(),
    requestedBy: String(from),
    status: 'pending',
    originGroupId: originGroupId || null,
    whatsappSharedBy: shareWhatsapp ? [String(from)] : [],
  }
}

/** O WhatsApp só é mútuo quando os DOIS participantes liberaram. */
function whatsappMutuallyShared(conn, a, b) {
  const shared = Array.isArray(conn?.whatsappSharedBy) ? conn.whatsappSharedBy : []
  return shared.includes(a) && shared.includes(b)
}

module.exports = { connectionId, buildRequest, whatsappMutuallyShared }
```

- [ ] **Step 4: Rode e confirme que passa**

Comando: `cd backend && node tests/connections.unit.js`
Esperado: PASS `connections.unit: ok (N asserções)`.

- [ ] **Step 5: Commit**

```bash
cd backend && git add lib/connections/model.js tests/connections.unit.js
git commit -m "feat(conexoes): modelo puro (id deterministico + regra do whatsapp)"
```

---

## Task 2: Handler backend das ações de conexão

**Arquivos:**
- Criar: `backend/lib/api-handlers/connections.js`
- Modificar: `backend/api/[...slug].js` (registrar o handler)
- Teste: estender `backend/tests/connections.unit.js`

O handler expõe ações por `?action=` (segue o padrão dos handlers existentes): `request`, `respond`, `list`, `share-wa`, `block`, `report`. Auth por `assertAuth` (padrão do projeto); o uid do chamador vem do token, nunca do body.

- [ ] **Step 1: Escreva o teste do fluxo (Firestore mockado) — que falha**

Adicione ao fim de `tests/connections.unit.js`, antes do `console.log`:

```js
// --- fluxo do handler com Firestore em memória ---
const handler = require('../lib/api-handlers/connections')

function makeDb(seed = {}) {
  const store = JSON.parse(JSON.stringify(seed))
  return {
    _store: store,
    collection: (c) => ({
      doc: (id) => ({
        async get() { const d = store[`${c}/${id}`]; return { exists: !!d, id, data: () => d, ref: this } },
        async set(v, opt) { store[`${c}/${id}`] = opt?.merge ? { ...(store[`${c}/${id}`] || {}), ...v } : v },
        async update(v) { store[`${c}/${id}`] = { ...(store[`${c}/${id}`] || {}), ...v } },
      }),
      where: () => ({ async get() {
        const docs = Object.entries(store).filter(([k]) => k.startsWith(`${c}/`))
          .map(([k, v]) => ({ id: k.split('/')[1], data: () => v }))
        return { docs, forEach: (f) => docs.forEach(f), empty: docs.length === 0 }
      } }),
    }),
  }
}
function res() { const r = { code: 0, body: null, status(c) { this.code = c; return this }, json(b) { this.body = b; return this } }; return r }

;(async () => {
  // request cria pending
  const db = makeDb({ 'users/aaa': { whatsappPhone: '+5511' }, 'users/bbb': { whatsappPhone: '+5522' } })
  const r1 = res()
  await handler.__run({ db, uid: 'aaa', action: 'request', body: { to: 'bbb', originGroupId: 'g1', shareWhatsapp: true } }, r1)
  eq(r1.body.ok, true, 'request ok')
  eq(db._store['connections/aaa_bbb'].status, 'pending', 'criou pending')

  // respond accept + share do outro → whatsapp mútuo
  const r2 = res()
  await handler.__run({ db, uid: 'bbb', action: 'respond', body: { withUid: 'aaa', accept: true, shareWhatsapp: true } }, r2)
  eq(db._store['connections/aaa_bbb'].status, 'accepted', 'aceitou')
  const r3 = res()
  await handler.__run({ db, uid: 'aaa', action: 'list', body: {} }, r3)
  const conn = r3.body.connections.find((c) => c.id === 'aaa_bbb')
  eq(conn.otherWhatsapp, '+5522', 'aaa ve o whatsapp de bbb (ambos liberaram)')

  // block esconde
  const r4 = res()
  await handler.__run({ db, uid: 'aaa', action: 'block', body: { withUid: 'bbb' } }, r4)
  eq(db._store['connections/aaa_bbb'].status, 'blocked', 'bloqueou')
})().then(() => console.log('connections handler: ok')).catch((e) => { console.error(e); process.exit(1) })
```

- [ ] **Step 2: Rode e confirme que falha**

Comando: `cd backend && node tests/connections.unit.js`
Esperado: FAIL `Cannot find module '../lib/api-handlers/connections'`.

- [ ] **Step 3: Implemente o handler**

```js
'use strict'
const admin = require('../_lib/admin')
const { assertAuth } = require('../_lib/auth')
const { connectionId, buildRequest, whatsappMutuallyShared } = require('../connections/model')

const FieldValue = admin.firestore.FieldValue

// Núcleo testável: recebe db/uid/action/body já resolvidos (sem depender de req/res reais).
async function __run({ db, uid, action, body }, res) {
  const connsafe = (v) => (typeof v === 'string' && v ? v : null)
  if (action === 'request') {
    const to = connsafe(body.to)
    const id = connectionId(uid, to)
    if (!id) return res.status(400).json({ ok: false, error: 'invalid_target' })
    const ref = db.collection('connections').doc(id)
    const snap = await ref.get()
    if (snap.exists && snap.data().status === 'blocked') return res.status(403).json({ ok: false, error: 'blocked' })
    if (snap.exists && snap.data().status === 'accepted') return res.json({ ok: true, already: true })
    const doc = buildRequest({ from: uid, to, originGroupId: body.originGroupId, shareWhatsapp: !!body.shareWhatsapp })
    await ref.set({ ...doc, createdAt: FieldValue.serverTimestamp() }, { merge: true })
    return res.json({ ok: true, id })
  }
  if (action === 'respond') {
    const other = connsafe(body.withUid)
    const id = connectionId(uid, other)
    if (!id) return res.status(400).json({ ok: false, error: 'invalid_target' })
    const ref = db.collection('connections').doc(id)
    const snap = await ref.get()
    if (!snap.exists || !snap.data().participants.includes(uid)) return res.status(404).json({ ok: false, error: 'not_found' })
    if (!body.accept) { await ref.update({ status: 'declined' }); return res.json({ ok: true, status: 'declined' }) }
    const patch = { status: 'accepted', acceptedAt: FieldValue.serverTimestamp() }
    if (body.shareWhatsapp) patch.whatsappSharedBy = FieldValue.arrayUnion(uid)
    await ref.update(patch)
    return res.json({ ok: true, status: 'accepted' })
  }
  if (action === 'share-wa') {
    const other = connsafe(body.withUid)
    const id = connectionId(uid, other)
    const ref = db.collection('connections').doc(id)
    const snap = await ref.get()
    if (!snap.exists || !snap.data().participants.includes(uid)) return res.status(404).json({ ok: false, error: 'not_found' })
    await ref.update({ whatsappSharedBy: FieldValue.arrayUnion(uid) })
    return res.json({ ok: true })
  }
  if (action === 'block' || action === 'report') {
    const other = connsafe(body.withUid)
    const id = connectionId(uid, other)
    const ref = db.collection('connections').doc(id)
    const snap = await ref.get()
    if (snap.exists && !snap.data().participants.includes(uid)) return res.status(403).json({ ok: false, error: 'forbidden' })
    await ref.set({ participants: [uid, other].sort(), status: 'blocked', blockedBy: uid, blockedAt: FieldValue.serverTimestamp() }, { merge: true })
    if (action === 'report') {
      await db.collection('connection_reports').doc().set({ by: uid, about: other, reason: body.reason || null, at: FieldValue.serverTimestamp() })
    }
    return res.json({ ok: true, status: 'blocked' })
  }
  if (action === 'list') {
    const q = await db.collection('connections').where('participants', 'array-contains', uid).get()
    const out = []
    for (const d of q.docs) {
      const c = d.data()
      if (c.status === 'blocked') continue
      const other = c.participants.find((p) => p !== uid)
      let otherWhatsapp = null
      if (c.status === 'accepted' && whatsappMutuallyShared(c, uid, other)) {
        const ou = await db.collection('users').doc(other).get()
        otherWhatsapp = ou.exists ? (ou.data().whatsappPhone || null) : null
      }
      out.push({
        id: d.id, other, status: c.status, requestedBy: c.requestedBy,
        originGroupId: c.originGroupId || null,
        iShared: (c.whatsappSharedBy || []).includes(uid),
        otherWhatsapp,
      })
    }
    return res.json({ ok: true, connections: out })
  }
  return res.status(400).json({ ok: false, error: 'unknown_action' })
}

// Entry point Vercel: resolve auth + action, delega ao __run.
module.exports = async (req, res) => {
  if (req.method === 'OPTIONS') return res.status(204).end()
  if (!assertAuth(req, res)) return
  const uid = req.authUid || req.query?.uid || req.body?.uid
  if (!uid) return res.status(401).json({ ok: false, error: 'no_uid' })
  const action = req.query?.action || req.body?.action
  const db = admin.firestore()
  try {
    return await __run({ db, uid, action, body: req.body || {} }, res)
  } catch (e) {
    return res.status(500).json({ ok: false, error: e?.message || 'error' })
  }
}
module.exports.__run = __run
```

> Nota ao engenheiro: confira em `lib/_lib/auth.js` como o uid autenticado é exposto (`req.authUid` ou similar) e ajuste a linha `const uid = ...` para casar com o padrão real; NÃO confie no uid vindo do body em produção.

- [ ] **Step 4: Registre o handler no roteador**

Em `backend/api/[...slug].js`, no objeto de handlers estáticos, adicione a linha (mantendo a ordem alfabética aproximada dos vizinhos):

```js
  connections: require('../lib/api-handlers/connections'),
```

- [ ] **Step 5: Rode e confirme que passa**

Comando: `cd backend && node tests/connections.unit.js`
Esperado: PASS `connections handler: ok`.

- [ ] **Step 6: Commit**

```bash
cd backend && git add lib/api-handlers/connections.js api/[...slug].js tests/connections.unit.js
git commit -m "feat(conexoes): handler de request/respond/list/block/report + whatsapp mutuo"
```

---

## Task 3: Regras Firestore para `connections`

**Arquivos:**
- Modificar: `frontend/firebase-rules-production.rules` e `frontend/firebase-rules-secure.rules`

O cliente NÃO escreve `connections` direto (as mutações passam pelo backend com Admin SDK, que ignora rules). As rules aqui **negam** escrita do cliente e permitem **leitura só aos participantes** (para o app poder ouvir mudanças da própria conexão sem passar pelo backend, se desejar). O WhatsApp do outro nunca está no doc cru, então leitura direta é segura.

- [ ] **Step 1: Adicione o bloco (dentro de `match /databases/{db}/documents`)**

```
    match /connections/{connId} {
      allow read: if request.auth != null && request.auth.uid in resource.data.participants;
      allow write: if false; // só o backend (Admin SDK) escreve
    }
    match /connection_reports/{id} {
      allow read, write: if false; // só backend
    }
```

- [ ] **Step 2: Verifique sintaxe**

Comando: `cd frontend && npx firebase deploy --only firestore:rules --dry-run` (ou o comando de rules do projeto). Esperado: sem erro de sintaxe. Se o projeto não tiver CLI configurada, ao menos revisar visualmente que os blocos fecham.

- [ ] **Step 3: Commit**

```bash
cd frontend && git add firebase-rules-production.rules firebase-rules-secure.rules
git commit -m "feat(conexoes): rules — leitura so participantes, escrita so backend"
```

> Deploy das rules é passo manual/aprovado à parte (regra do projeto: nunca alterar regras sem aprovação explícita). Este step só edita o arquivo.

---

## Task 4: Service de conexões (frontend)

**Arquivos:**
- Criar: `frontend/src/services/ConnectionsService.ts`
- Criar: `frontend/src/services/__tests__/connectionsModel.spec.ts`

- [ ] **Step 1: Teste da função pura espelhada (id determinístico) — falha**

```ts
import { describe, expect, it } from 'vitest'
import { connectionId } from '../ConnectionsService'

describe('connectionId', () => {
  it('ordena os uids', () => {
    expect(connectionId('bbb', 'aaa')).toBe('aaa_bbb')
    expect(connectionId('aaa', 'bbb')).toBe('aaa_bbb')
  })
  it('null p/ mesma pessoa ou vazio', () => {
    expect(connectionId('aaa', 'aaa')).toBeNull()
    expect(connectionId('', 'bbb')).toBeNull()
  })
})
```

- [ ] **Step 2: Rode e confirme que falha**

Comando: `cd frontend && npx vitest run src/services/__tests__/connectionsModel.spec.ts`
Esperado: FAIL (módulo/função inexistente).

- [ ] **Step 3: Implemente o service**

```ts
import { backendFetch } from '../config/backend' // usar o mesmo helper de fetch autenticado do projeto

export type ConnectionStatus = 'pending' | 'accepted' | 'declined' | 'blocked'
export type Connection = {
  id: string
  other: string
  status: ConnectionStatus
  requestedBy: string
  originGroupId: string | null
  iShared: boolean
  otherWhatsapp: string | null
}

/** id determinístico da dupla — espelha o backend (para UI otimista). */
export function connectionId(a: string, b: string): string | null {
  if (!a || !b || a === b) return null
  return [a, b].sort().join('_')
}

export async function requestConnection(to: string, originGroupId: string | null, shareWhatsapp: boolean) {
  return backendFetch('/api/connections?action=request', { method: 'POST', body: JSON.stringify({ to, originGroupId, shareWhatsapp }) })
}
export async function respondConnection(withUid: string, accept: boolean, shareWhatsapp: boolean) {
  return backendFetch('/api/connections?action=respond', { method: 'POST', body: JSON.stringify({ withUid, accept, shareWhatsapp }) })
}
export async function shareWhatsapp(withUid: string) {
  return backendFetch('/api/connections?action=share-wa', { method: 'POST', body: JSON.stringify({ withUid }) })
}
export async function blockConnection(withUid: string, report?: string) {
  const action = report ? 'report' : 'block'
  return backendFetch(`/api/connections?action=${action}`, { method: 'POST', body: JSON.stringify({ withUid, reason: report || null }) })
}
export async function listConnections(): Promise<{ ok: boolean; connections: Connection[] }> {
  return backendFetch('/api/connections?action=list', { method: 'POST', body: JSON.stringify({}) })
}
```

> Nota: confirme o nome/caminho real do helper de fetch autenticado (procure por `backendFetch`/`authedFetch`/`apiFetch` em `src/`) e use-o; ele já anexa o token do usuário.

- [ ] **Step 4: Rode e confirme que passa**

Comando: `cd frontend && npx vitest run src/services/__tests__/connectionsModel.spec.ts`
Esperado: PASS.

- [ ] **Step 5: Commit**

```bash
cd frontend && git add src/services/ConnectionsService.ts src/services/__tests__/connectionsModel.spec.ts
git commit -m "feat(conexoes): service + tipos + id deterministico (frontend)"
```

---

## Task 5: Botão "Conectar" na matriz do GroupsScreen

**Arquivos:**
- Modificar: `frontend/src/screens/groups/GroupsScreen.tsx`

Na linha de cada membro (fora o viewer) na matriz de sinastria, adicionar um botão "Conectar" que abre um modal simples ("Conectar com {nome}? [ ] Compartilhar meu WhatsApp") e chama `requestConnection(member.userId, selectedGroup?.id ?? null, shareWa)`. Estado local do botão: `idle` → `sent` (após sucesso). Não recalcular sinastria (já está na tela).

- [ ] **Step 1: Importar o service (topo do arquivo)**

```ts
import { requestConnection } from '../../services/ConnectionsService'
```

- [ ] **Step 2: Estado do modal + handler (dentro do componente)**

```ts
const [connectTarget, setConnectTarget] = useState<{ userId: string; name: string } | null>(null)
const [connectShareWa, setConnectShareWa] = useState(false)
const [connectSentIds, setConnectSentIds] = useState<Set<string>>(new Set())
const submitConnect = async () => {
  if (!connectTarget) return
  try {
    await requestConnection(connectTarget.userId, selectedGroup?.id ?? null, connectShareWa)
    setConnectSentIds((prev) => new Set(prev).add(connectTarget.userId))
  } catch (e) { /* mostra erro inline; não relança */ }
  setConnectTarget(null); setConnectShareWa(false)
}
```

- [ ] **Step 3: Botão por membro (no bloco que renderiza cada dupla/membro)**

No ponto onde cada `member` (com `member.userId !== user.uid`) é renderizado na matriz, adicionar:

```tsx
{member.userId !== user?.uid ? (
  <TouchableOpacity
    style={styles.connectBtn}
    disabled={connectSentIds.has(member.userId)}
    onPress={() => setConnectTarget({ userId: member.userId, name: member.name || 'esta pessoa' })}
  >
    <Text style={styles.connectBtnText}>
      {connectSentIds.has(member.userId)
        ? tl('Pedido enviado', 'Request sent', 'Solicitud enviada', 'Richiesta inviata')
        : tl('Conectar', 'Connect', 'Conectar', 'Connetti')}
    </Text>
  </TouchableOpacity>
) : null}
```

- [ ] **Step 4: Modal de confirmação (perto dos outros modais do arquivo)**

```tsx
<Modal visible={!!connectTarget} transparent animationType="fade" onRequestClose={() => setConnectTarget(null)}>
  <View style={styles.modalOverlay}>
    <View style={styles.modalCard}>
      <Text style={styles.modalTitle}>
        {tl('Conectar com', 'Connect with', 'Conectar con', 'Connetti con')} {connectTarget?.name}?
      </Text>
      <TouchableOpacity style={styles.checkRow} onPress={() => setConnectShareWa((v) => !v)}>
        <Text style={styles.checkbox}>{connectShareWa ? '[x]' : '[ ]'}</Text>
        <Text style={styles.checkLabel}>
          {tl('Compartilhar meu WhatsApp', 'Share my WhatsApp', 'Compartir mi WhatsApp', 'Condividi il mio WhatsApp')}
        </Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.modalPrimary} onPress={submitConnect}>
        <Text style={styles.modalPrimaryText}>{tl('Enviar pedido', 'Send request', 'Enviar', 'Invia')}</Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={() => setConnectTarget(null)}>
        <Text style={styles.modalCancel}>{tl('Cancelar', 'Cancel', 'Cancelar', 'Annulla')}</Text>
      </TouchableOpacity>
    </View>
  </View>
</Modal>
```

> Estilos `connectBtn/connectBtnText/checkRow/checkbox/checkLabel/modalPrimary/...`: seguir os estilos já usados no `GroupsScreen` (reaproveitar `modalOverlay`/`modalCard`/`modalTitle` existentes; criar só os que faltam, no mesmo padrão). Trocar o `'☫'` por um ícone/quadrado real conforme o padrão de checkbox do app.

- [ ] **Step 5: Verificação de tipos**

Comando: `cd frontend && npx tsc --noEmit`
Esperado: exit 0.

- [ ] **Step 6: Commit**

```bash
cd frontend && git add src/screens/groups/GroupsScreen.tsx
git commit -m "feat(conexoes): botao Conectar na matriz de sinastria dos grupos"
```

---

## Task 6: Tela "Minhas Conexões"

**Arquivos:**
- Criar: `frontend/src/screens/connections/ConnectionsScreen.tsx`
- Modificar: `frontend/src/navigation/AppNavigator.tsx` (rota `Connections`)

Seções: **Pedidos recebidos** (aceitar/recusar + toggle compartilhar WA no aceite), **Pedidos enviados** (pendente), **Conexões** (nome/foto/trio/compatibilidade + WhatsApp se `otherWhatsapp` != null, senão botão "compartilhar meu WhatsApp"), com **bloquear/denunciar** por item. Carrega via `listConnections()` no mount + pull-to-refresh.

- [ ] **Step 1: Esqueleto da tela**

```tsx
import React, { useCallback, useEffect, useState } from 'react'
import { View, Text, FlatList, TouchableOpacity, RefreshControl, Linking } from 'react-native'
import { listConnections, respondConnection, shareWhatsapp, blockConnection, type Connection } from '../../services/ConnectionsService'
import { useAuth } from '../../hooks/useAuth'

export default function ConnectionsScreen() {
  const { user } = useAuth()
  const [items, setItems] = useState<Connection[]>([])
  const [loading, setLoading] = useState(true)
  const load = useCallback(async () => {
    setLoading(true)
    try { const r = await listConnections(); setItems(r.connections || []) } catch { /* mantem */ }
    setLoading(false)
  }, [])
  useEffect(() => { load() }, [load])

  const received = items.filter((c) => c.status === 'pending' && c.requestedBy !== user?.uid)
  const sent = items.filter((c) => c.status === 'pending' && c.requestedBy === user?.uid)
  const accepted = items.filter((c) => c.status === 'accepted')

  const accept = async (c: Connection, shareWa: boolean) => { await respondConnection(c.other, true, shareWa); load() }
  const decline = async (c: Connection) => { await respondConnection(c.other, false, false); load() }
  const share = async (c: Connection) => { await shareWhatsapp(c.other); load() }
  const block = async (c: Connection) => { await blockConnection(c.other); load() }

  // render: 3 seções (received/sent/accepted) usando os handlers acima.
  // WhatsApp: se c.otherWhatsapp -> botão que abre Linking.openURL(`https://wa.me/${c.otherWhatsapp.replace(/\D/g,'')}`)
  //           senão e !c.iShared -> botão "compartilhar meu WhatsApp" (share(c))
  return (
    <View style={{ flex: 1 }}>
      <FlatList
        data={[...received, ...sent, ...accepted]}
        keyExtractor={(c) => c.id}
        refreshControl={<RefreshControl refreshing={loading} onRefresh={load} />}
        renderItem={({ item }) => null /* preencher conforme o design das linhas */}
      />
    </View>
  )
}
```

- [ ] **Step 2: Preencher `renderItem`** com as 3 variações (recebido: aceitar/recusar + checkbox WA; enviado: "pendente"; aceito: trio + compatibilidade + WhatsApp/compartilhar + bloquear). Seguir o visual das linhas de membro do `GroupsScreen` (reaproveitar componentes de avatar/trio se existirem).

- [ ] **Step 3: Registrar a rota**

Em `AppNavigator.tsx`, ao lado das outras `RootStack.Screen`:

```tsx
<RootStack.Screen name="Connections" component={require('../screens/connections/ConnectionsScreen').default} options={{ headerShown: true, title: 'Minhas conexões', headerStyle: { backgroundColor: '#0F0F23' }, headerTintColor: '#FFFFFF' }} />
```

E um ponto de entrada (ex.: botão no header de Grupos ou item no menu) navegando `navigation.navigate('Connections')`.

- [ ] **Step 4: Verificação de tipos**

Comando: `cd frontend && npx tsc --noEmit`
Esperado: exit 0.

- [ ] **Step 5: Commit**

```bash
cd frontend && git add src/screens/connections/ConnectionsScreen.tsx src/navigation/AppNavigator.tsx
git commit -m "feat(conexoes): tela Minhas Conexoes (pedidos/aceitas/whatsapp/bloquear)"
```

---

## Task 7: Notificação do pedido (reuso do push + agente)

**Arquivos:**
- Modificar: `backend/lib/api-handlers/connections.js` (na ação `request` e `respond`, disparar a notificação best-effort)

- [ ] **Step 1: Após criar o pending (ação `request`), enfileirar a notificação**

Antes do `return res.json({ ok: true, id })`, adicionar (best-effort, não bloqueia):

```js
try {
  const requester = await db.collection('users').doc(uid).get()
  const name = requester.exists ? (requester.data().name || requester.data().displayName || 'Alguém') : 'Alguém'
  await db.collection('notifications').add({
    userId: to,
    source: 'connection',
    title: 'Novo pedido de conexão',
    body: `${name} quer se conectar com você.`,
    type: 'connection_request',
    pushEligible: true,
    pushSentAt: null,
    createdAt: FieldValue.serverTimestamp(),
  })
} catch (e) { /* notificação é best-effort */ }
```

> Isso reusa a fila de push existente (`push-dispatch` lê `notifications` com `pushEligible/pushSentAt`). O espelho no agente WhatsApp entra numa iteração seguinte.

- [ ] **Step 2: Rode os testes do handler (não devem quebrar — o mock ignora `.add`)**

Comando: `cd backend && node tests/connections.unit.js`
Esperado: PASS (ajuste o mock `makeDb` para ter `collection().add()` no-op se necessário).

- [ ] **Step 3: Commit**

```bash
cd backend && git add lib/api-handlers/connections.js tests/connections.unit.js
git commit -m "feat(conexoes): notifica o pedido de conexao via fila de push"
```

---

## Task 8: i18n das strings

**Arquivos:**
- Modificar: `frontend/src/i18n/appI18n.ts` (chaves `connections.*` nos 4 idiomas — pt-BR base, en-US sem "will", es-ES sem tildes, it-IT sem acentos)

- [ ] **Step 1: Adicionar as chaves usadas** (título da tela, seções "Pedidos recebidos/enviados", "Conexões", botões "Aceitar/Recusar/Bloquear/Denunciar/Abrir WhatsApp/Compartilhar meu WhatsApp", vazios). Usar o mesmo padrão de bloco por idioma já existente no arquivo.

- [ ] **Step 2: Verificação de tipos + paridade i18n**

Comando: `cd frontend && npx tsc --noEmit` (exit 0) e conferir que as 4 línguas têm as mesmas chaves `connections.*`.

- [ ] **Step 3: Commit**

```bash
cd frontend && git add src/i18n/appI18n.ts
git commit -m "feat(conexoes): i18n das strings (4 idiomas)"
```

---

## Verificação final da Fase 1

- [ ] Backend: `cd backend && node tests/connections.unit.js` → PASS.
- [ ] Frontend: `cd frontend && npx vitest run` → tudo verde; `npx tsc --noEmit` → 0.
- [ ] Fluxo manual (PWA): em Grupos, "Conectar" com um membro → o outro recebe o pedido → aceita compartilhando WA → ambos veem o WhatsApp em "Minhas conexões" → bloquear esconde de ambos.
- [ ] Deploy: frontend auto; backend `npm run deploy` (poll READY); rules NÃO deployadas sem aprovação explícita.

## Self-review deste plano
- **Cobertura da spec Fase 1:** conectar (T5), pedido/aceite/lista/bloquear/denunciar + whatsapp mútuo (T2), persistência (`connections` collection), notificação (T7), i18n (T8), regras (T3). ✔
- **Placeholders:** nenhum "TODO/TBD" em lógica; os pontos "seguir o padrão do arquivo" são de estilo visual, com o arquivo-referência nomeado. Os `renderItem` de UI (T6 Step 2) descrevem exatamente as 3 variações e os handlers já existem.
- **Consistência de tipos:** `connectionId/buildRequest/whatsappMutuallyShared` (model) e `Connection`/`listConnections` (service) usados de forma consistente entre tasks.
- **Pontos a confirmar no codebase (anotados nas tasks):** nome real do helper de fetch autenticado (T4) e como `assertAuth` expõe o uid (T2).
