import { readFileSync } from 'node:fs'
import { resolve } from 'node:path'
import { beforeAll, afterAll, beforeEach, describe, it } from 'vitest'
import {
  assertFails,
  assertSucceeds,
  initializeTestEnvironment,
  type RulesTestEnvironment,
} from '@firebase/rules-unit-testing'
import { doc, getDoc, setDoc, updateDoc } from 'firebase/firestore'

let testEnv: RulesTestEnvironment

const rules = readFileSync(resolve(process.cwd(), 'firebase-rules-production.rules'), 'utf8')

describe('firestore production rules', () => {
  beforeAll(async () => {
    testEnv = await initializeTestEnvironment({
      projectId: 'tabula-estelar-rules',
      firestore: { rules },
    })
  })

  afterAll(async () => {
    await testEnv.cleanup()
  })

  beforeEach(async () => {
    await testEnv.clearFirestore()
    await testEnv.withSecurityRulesDisabled(async (context) => {
      const db = context.firestore()
      await setDoc(doc(db, 'users/u1'), { displayName: 'User One' })
      await setDoc(doc(db, 'users/u2'), { displayName: 'User Two' })
      await setDoc(doc(db, 'userStatus/u1'), { score: 60, userId: 'u1' })
      await setDoc(doc(db, 'groups/g1'), { members: ['u1', 'u2'], createdBy: 'u1' })
      await setDoc(doc(db, 'groupAlerts/a1'), { groupId: 'g1', message: 'alert' })
      await setDoc(doc(db, 'notifications/n1'), { userId: 'u1', isRead: false })
    })
  })

  it('allows user to read own userStatus and blocks write', async () => {
    const db = testEnv.authenticatedContext('u1').firestore()
    await assertSucceeds(getDoc(doc(db, 'userStatus/u1')))
    await assertFails(setDoc(doc(db, 'userStatus/u1'), { score: 99 }, { merge: true }))
  })

  it('allows group member to read group alert and blocks non-member', async () => {
    const memberDb = testEnv.authenticatedContext('u1').firestore()
    const outsiderDb = testEnv.authenticatedContext('u3').firestore()
    await assertSucceeds(getDoc(doc(memberDb, 'groupAlerts/a1')))
    await assertFails(getDoc(doc(outsiderDb, 'groupAlerts/a1')))
  })

  it('allows notification read-flag update only', async () => {
    const db = testEnv.authenticatedContext('u1').firestore()
    await assertSucceeds(updateDoc(doc(db, 'notifications/n1'), { isRead: true, readAt: new Date() }))
    await assertFails(updateDoc(doc(db, 'notifications/n1'), { message: 'tampered' }))
  })

  it('blocks unauthenticated access', async () => {
    const db = testEnv.unauthenticatedContext().firestore()
    await assertFails(getDoc(doc(db, 'users/u1')))
  })

  it('prevents cross-user write under users', async () => {
    const db = testEnv.authenticatedContext('u2').firestore()
    await assertFails(setDoc(doc(db, 'users/u1'), { displayName: 'Hacked' }, { merge: true }))
  })
})
