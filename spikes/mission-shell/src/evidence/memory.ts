import type {
  EvidenceEvent,
  EvidenceSnapshot,
  EvidenceStore,
  PersistedMissionSession,
} from "../contracts/evidence";
import {
  canonicalizeEvidenceEvents,
  cloneEvidenceEvent,
  cloneEvidenceSnapshot,
  clonePersistedMissionSession,
  createEvidenceExport,
  emptyEvidenceSnapshot,
  type EvidenceClock,
} from "./codec";

export interface MemoryEvidenceStoreOptions {
  readonly initialSnapshot?: EvidenceSnapshot;
  readonly now?: EvidenceClock;
}

export function createMemoryEvidenceStore(
  options: MemoryEvidenceStoreOptions = {},
): EvidenceStore {
  const now = options.now ?? (() => new Date().toISOString());
  const initialSnapshot = options.initialSnapshot
    ? cloneEvidenceSnapshot(options.initialSnapshot)
    : emptyEvidenceSnapshot();
  let events = canonicalizeEvidenceEvents(initialSnapshot.events);
  let session = initialSnapshot.session;
  let closed = false;

  const load = async (): Promise<EvidenceSnapshot> => {
    assertOpen();
    return cloneEvidenceSnapshot({
      schemaVersion: 1,
      events,
      session,
    });
  };

  const assertOpen = (): void => {
    if (closed) {
      throw new Error("EvidenceStore is closed.");
    }
  };

  return {
    load,
    async append(event: EvidenceEvent) {
      assertOpen();
      const boundedEvent = cloneEvidenceEvent(event);

      if (!events.some((existing) => existing.id === boundedEvent.id)) {
        events = canonicalizeEvidenceEvents([...events, boundedEvent]);
      }

      return load();
    },
    async saveSession(nextSession: PersistedMissionSession) {
      assertOpen();
      session = clonePersistedMissionSession(nextSession);
    },
    async export() {
      assertOpen();
      return createEvidenceExport(await load(), now);
    },
    async reset() {
      assertOpen();
      events = [];
      session = null;
    },
    close() {
      closed = true;
    },
  };
}
