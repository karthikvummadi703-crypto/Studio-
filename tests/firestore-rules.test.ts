import { describe, it, beforeAll, afterAll, beforeEach } from 'vitest';
import {
  initializeTestEnvironment, assertSucceeds, assertFails,
  type RulesTestEnvironment,
} from '@firebase/rules-unit-testing';
import { readFileSync } from 'fs';
import { setDoc, getDoc, deleteDoc, updateDoc, doc } from 'firebase/firestore';

let testEnv: RulesTestEnvironment;

beforeAll(async () => {
  testEnv = await initializeTestEnvironment({
    projectId: 'ecopulse-test',
    firestore: {
      rules: readFileSync('firestore.rules', 'utf8'),
      host: '127.0.0.1',
      port: 8080,
    },
  });
});

afterAll(async () => testEnv.cleanup());
beforeEach(async () => testEnv.clearFirestore());

// ── users ─────────────────────────────────────────────────────────────────────
describe('users collection', () => {
  it('allows user to read own profile', async () => {
    await testEnv.withSecurityRulesDisabled((ctx) =>
      setDoc(doc(ctx.firestore(), 'users/alice'), { fullName: 'Alice' })
    );
    const alice = testEnv.authenticatedContext('alice');
    await assertSucceeds(getDoc(doc(alice.firestore(), 'users/alice')));
  });
  it('denies reading another user profile', async () => {
    await testEnv.withSecurityRulesDisabled((ctx) =>
      setDoc(doc(ctx.firestore(), 'users/alice'), { fullName: 'Alice' })
    );
    const bob = testEnv.authenticatedContext('bob');
    await assertFails(getDoc(doc(bob.firestore(), 'users/alice')));
  });
  it('denies client delete', async () => {
    await testEnv.withSecurityRulesDisabled((ctx) =>
      setDoc(doc(ctx.firestore(), 'users/alice'), { fullName: 'Alice' })
    );
    const alice = testEnv.authenticatedContext('alice');
    await assertFails(deleteDoc(doc(alice.firestore(), 'users/alice')));
  });
  it('denies unauthenticated access', async () => {
    const anon = testEnv.unauthenticatedContext();
    await assertFails(getDoc(doc(anon.firestore(), 'users/alice')));
  });
});

// ── calculator_records ────────────────────────────────────────────────────────
describe('calculator_records collection', () => {
  it('allows owner read/write', async () => {
    const alice = testEnv.authenticatedContext('alice');
    await assertSucceeds(setDoc(doc(alice.firestore(), 'calculator_records/r1'), { userId: 'alice', co2: 10 }));
    await assertSucceeds(getDoc(doc(alice.firestore(), 'calculator_records/r1')));
  });
  it('denies reading another user record', async () => {
    await testEnv.withSecurityRulesDisabled((ctx) =>
      setDoc(doc(ctx.firestore(), 'calculator_records/r2'), { userId: 'bob', co2: 5 })
    );
    const alice = testEnv.authenticatedContext('alice');
    await assertFails(getDoc(doc(alice.firestore(), 'calculator_records/r2')));
  });
  it('denies changing userId on update', async () => {
    await testEnv.withSecurityRulesDisabled((ctx) =>
      setDoc(doc(ctx.firestore(), 'calculator_records/r3'), { userId: 'alice', co2: 1 })
    );
    const alice = testEnv.authenticatedContext('alice');
    await assertFails(
      setDoc(doc(alice.firestore(), 'calculator_records/r3'), { userId: 'bob', co2: 1 }, { merge: true })
    );
  });
});

// ── activities — append-only ──────────────────────────────────────────────────
describe('activities collection (append-only)', () => {
  it('allows owner to create', async () => {
    const alice = testEnv.authenticatedContext('alice');
    await assertSucceeds(setDoc(doc(alice.firestore(), 'activities/a1'), { userId: 'alice', type: 'walk' }));
  });
  it('denies update', async () => {
    await testEnv.withSecurityRulesDisabled((ctx) =>
      setDoc(doc(ctx.firestore(), 'activities/a1'), { userId: 'alice', type: 'walk' })
    );
    const alice = testEnv.authenticatedContext('alice');
    await assertFails(updateDoc(doc(alice.firestore(), 'activities/a1'), { type: 'edited' }));
  });
  it('denies delete', async () => {
    await testEnv.withSecurityRulesDisabled((ctx) =>
      setDoc(doc(ctx.firestore(), 'activities/a1'), { userId: 'alice', type: 'walk' })
    );
    const alice = testEnv.authenticatedContext('alice');
    await assertFails(deleteDoc(doc(alice.firestore(), 'activities/a1')));
  });
});

// ── ai_conversations ──────────────────────────────────────────────────────────
describe('ai_conversations collection', () => {
  it('allows owner to create conversation', async () => {
    const alice = testEnv.authenticatedContext('alice');
    await assertSucceeds(
      setDoc(doc(alice.firestore(), 'ai_conversations/c1'), {
        userId: 'alice', messages: [], title: 'Chat', createdAt: new Date(),
      })
    );
  });
  it('denies creating with different userId', async () => {
    const bob = testEnv.authenticatedContext('bob');
    await assertFails(
      setDoc(doc(bob.firestore(), 'ai_conversations/c2'), {
        userId: 'alice', messages: [], createdAt: new Date(),
      })
    );
  });
  it('allows owner to read their conversation', async () => {
    await testEnv.withSecurityRulesDisabled((ctx) =>
      setDoc(doc(ctx.firestore(), 'ai_conversations/c1'), { userId: 'alice', messages: [] })
    );
    const alice = testEnv.authenticatedContext('alice');
    await assertSucceeds(getDoc(doc(alice.firestore(), 'ai_conversations/c1')));
  });
  it('denies non-owner reading', async () => {
    await testEnv.withSecurityRulesDisabled((ctx) =>
      setDoc(doc(ctx.firestore(), 'ai_conversations/c1'), { userId: 'alice', messages: [] })
    );
    const bob = testEnv.authenticatedContext('bob');
    await assertFails(getDoc(doc(bob.firestore(), 'ai_conversations/c1')));
  });
  it('denies changing userId on update', async () => {
    await testEnv.withSecurityRulesDisabled((ctx) =>
      setDoc(doc(ctx.firestore(), 'ai_conversations/c1'), { userId: 'alice', messages: [] })
    );
    const alice = testEnv.authenticatedContext('alice');
    await assertFails(
      updateDoc(doc(alice.firestore(), 'ai_conversations/c1'), { userId: 'hacker' })
    );
  });
});

// ── rate_limits ───────────────────────────────────────────────────────────────
describe('rate_limits — fully locked', () => {
  it('denies authenticated read', async () => {
    const alice = testEnv.authenticatedContext('alice');
    await assertFails(getDoc(doc(alice.firestore(), 'rate_limits/1.2.3.4')));
  });
  it('denies authenticated write', async () => {
    const alice = testEnv.authenticatedContext('alice');
    await assertFails(setDoc(doc(alice.firestore(), 'rate_limits/1.2.3.4'), { count: 1 }));
  });
  it('denies unauthenticated access', async () => {
    const anon = testEnv.unauthenticatedContext();
    await assertFails(getDoc(doc(anon.firestore(), 'rate_limits/1.2.3.4')));
  });
});
