import { afterEach, describe, expect, it } from "vitest";
import type { EvidenceStore } from "../../src/contracts";
import {
  createEvidenceStore,
  createMemoryEvidenceStore,
} from "../../src/evidence";
import { evidenceEvent, persistedSession } from "./fixtures";

const databaseNames = new Set<string>();

function uniqueDatabaseName(): string {
  const name = `mission-shell-test-${crypto.randomUUID()}`;
  databaseNames.add(name);
  return name;
}

async function deleteDatabase(name: string): Promise<void> {
  await new Promise<void>((resolve, reject) => {
    const request = indexedDB.deleteDatabase(name);
    request.onsuccess = () => resolve();
    request.onerror = () => reject(request.error ?? new Error(`Could not delete ${name}.`));
    request.onblocked = () => reject(new Error(`Deletion of ${name} was blocked by an open connection.`));
  });
}

afterEach(async () => {
  const pending = [...databaseNames];
  databaseNames.clear();
  await Promise.all(pending.map(deleteDatabase));
});

async function exerciseSnapshotLifecycle(store: EvidenceStore): Promise<void> {
  const initial = await store.load();
  expect(initial).toEqual({ schemaVersion: 1, events: [], session: null });

  const event = evidenceEvent();
  const afterAppend = await store.append(event);
  const afterDuplicate = await store.append(event);
  expect(afterAppend.events).toEqual([event]);
  expect(afterDuplicate.events).toEqual([event]);

  const session = persistedSession();
  await store.saveSession(session);
  expect(await store.load()).toEqual({
    schemaVersion: 1,
    events: [event],
    session,
  });

  const exported = await store.export();
  expect(exported).toMatchObject({
    description: "Synthetic local mission-shell spike evidence",
    snapshot: { schemaVersion: 1, events: [event], session },
  });

  await store.reset();
  expect(await store.load()).toEqual({ schemaVersion: 1, events: [], session: null });
}

describe("memory EvidenceStore", () => {
  it("persists, exports, deduplicates, and fully resets a snapshot", async () => {
    const store = createMemoryEvidenceStore({
      now: () => "2026-09-01T12:05:00.000Z",
    });

    await exerciseSnapshotLifecycle(store);
    expect((await store.export()).exportedAt).toBe("2026-09-01T12:05:00.000Z");
    store.close();
  });

  it("returns defensive snapshots instead of live references", async () => {
    const store = createMemoryEvidenceStore();
    const original = evidenceEvent();
    const appended = await store.append(original);

    (appended.events as (typeof original)[]).push(
      evidenceEvent({ id: "caller-only-mutation" }),
    );

    expect((await store.load()).events).toEqual([original]);
    store.close();
  });

  it("rejects operations after close", async () => {
    const store = createMemoryEvidenceStore();
    store.close();

    await expect(store.load()).rejects.toThrow(/closed/i);
    await expect(store.append(evidenceEvent())).rejects.toThrow(/closed/i);
  });
});

describe("IndexedDB EvidenceStore", () => {
  it("reloads event and Mission session through a fresh adapter instance", async () => {
    const databaseName = uniqueDatabaseName();
    const first = createEvidenceStore({ databaseName });
    const event = evidenceEvent();
    const session = persistedSession({ stage: "repair", sourceRevision: 8 });

    await first.append(event);
    await first.saveSession(session);
    first.close();

    const reloaded = createEvidenceStore({ databaseName });
    expect(await reloaded.load()).toEqual({
      schemaVersion: 1,
      events: [event],
      session,
    });

    await reloaded.reset();
    reloaded.close();

    const afterReset = createEvidenceStore({ databaseName });
    expect(await afterReset.load()).toEqual({
      schemaVersion: 1,
      events: [],
      session: null,
    });
    afterReset.close();
  });

  it("uses the same export and reset contract as the memory adapter", async () => {
    const store = createEvidenceStore({
      databaseName: uniqueDatabaseName(),
      now: () => "2026-09-01T12:10:00.000Z",
    });

    await exerciseSnapshotLifecycle(store);
    expect((await store.export()).exportedAt).toBe("2026-09-01T12:10:00.000Z");
    store.close();
  });

  it("rejects malformed records at the storage boundary", async () => {
    const store = createEvidenceStore({ databaseName: uniqueDatabaseName() });
    const malformed = {
      ...evidenceEvent(),
      privacy: "remote-and-unbounded",
    };

    await expect(store.append(malformed as never)).rejects.toThrow(/privacy/i);
    expect((await store.load()).events).toEqual([]);
    store.close();
  });
});
