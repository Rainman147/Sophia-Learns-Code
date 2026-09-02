import { openDB, type DBSchema, type IDBPDatabase } from "idb";

import type {
  EvidenceEvent,
  EvidenceSnapshot,
  EvidenceStore,
  PersistedMissionSession,
} from "../contracts/evidence";
import {
  cloneEvidenceEvent,
  cloneEvidenceSnapshot,
  clonePersistedMissionSession,
  createEvidenceExport,
  EVIDENCE_SCHEMA_VERSION,
  type EvidenceClock,
} from "./codec";

const EVENT_STORE = "evidence-events";
const SESSION_STORE = "mission-session";
const EVENT_ORDER_INDEX = "by-occurred-at-and-id";
const ACTIVE_SESSION_KEY = "active";

export const DEFAULT_EVIDENCE_DATABASE_NAME =
  "sophia-mission-shell-evidence";
export const EVIDENCE_DATABASE_VERSION = EVIDENCE_SCHEMA_VERSION;

interface MissionShellEvidenceDatabase extends DBSchema {
  "evidence-events": {
    key: string;
    value: EvidenceEvent;
    indexes: {
      "by-occurred-at-and-id": [string, string];
    };
  };
  "mission-session": {
    key: string;
    value: PersistedMissionSession;
  };
}

export interface EvidenceStoreOptions {
  readonly databaseName?: string;
  readonly now?: EvidenceClock;
}

export function createEvidenceStore(
  options: EvidenceStoreOptions = {},
): EvidenceStore {
  const databaseName =
    options.databaseName ?? DEFAULT_EVIDENCE_DATABASE_NAME;
  const now = options.now ?? (() => new Date().toISOString());
  let database: IDBPDatabase<MissionShellEvidenceDatabase> | null = null;
  let databasePromise: Promise<
    IDBPDatabase<MissionShellEvidenceDatabase>
  > | null = null;
  let closed = false;
  let invalidatedByVersionChange: Error | null = null;

  const assertOpen = (): void => {
    if (closed) {
      throw new Error("EvidenceStore is closed.");
    }

    if (invalidatedByVersionChange) {
      throw invalidatedByVersionChange;
    }
  };

  const getDatabase = async (): Promise<
    IDBPDatabase<MissionShellEvidenceDatabase>
  > => {
    assertOpen();

    if (database) {
      return database;
    }

    if (typeof indexedDB === "undefined") {
      throw new Error(
        "IndexedDB is unavailable. Use createMemoryEvidenceStore for non-browser execution.",
      );
    }

    if (!databasePromise) {
      databasePromise = openEvidenceDatabase();
    }

    const pendingDatabase = databasePromise;

    try {
      const openedDatabase = await pendingDatabase;

      if (closed) {
        openedDatabase.close();
        throw new Error("EvidenceStore was closed while IndexedDB was opening.");
      }

      if (invalidatedByVersionChange) {
        openedDatabase.close();
        throw invalidatedByVersionChange;
      }

      assertDatabaseShape(openedDatabase);
      database = openedDatabase;
      databasePromise = null;
      return openedDatabase;
    } catch (error) {
      if (databasePromise === pendingDatabase) {
        databasePromise = null;
      }

      throw describeOpenFailure(error, databaseName);
    }
  };

  const openEvidenceDatabase = (): Promise<
    IDBPDatabase<MissionShellEvidenceDatabase>
  > =>
    openDB<MissionShellEvidenceDatabase>(
      databaseName,
      EVIDENCE_DATABASE_VERSION,
      {
        upgrade(openedDatabase, oldVersion) {
          if (oldVersion !== 0) {
            throw new Error(
              `No EvidenceStore migration is defined from schema version ${oldVersion}.`,
            );
          }

          const eventStore = openedDatabase.createObjectStore(EVENT_STORE, {
            keyPath: "id",
          });
          eventStore.createIndex(
            EVENT_ORDER_INDEX,
            ["occurredAt", "id"],
            { unique: true },
          );
          openedDatabase.createObjectStore(SESSION_STORE);
        },
        blocking(currentVersion, blockedVersion) {
          invalidatedByVersionChange = new Error(
            `EvidenceStore schema ${currentVersion} was superseded by schema ${String(blockedVersion)}. Reload with compatible code.`,
          );
          database?.close();
          database = null;
          databasePromise = null;
        },
        terminated() {
          database = null;
          databasePromise = null;
        },
      },
    );

  const load = async (): Promise<EvidenceSnapshot> => {
    assertOpen();
    const openedDatabase = await getDatabase();
    const transaction = openedDatabase.transaction(
      [EVENT_STORE, SESSION_STORE],
      "readonly",
    );
    const eventsRequest = transaction
      .objectStore(EVENT_STORE)
      .index(EVENT_ORDER_INDEX)
      .getAll();
    const sessionRequest = transaction
      .objectStore(SESSION_STORE)
      .get(ACTIVE_SESSION_KEY);
    const [events, session] = await Promise.all([
      eventsRequest,
      sessionRequest,
    ]);
    await transaction.done;

    return cloneEvidenceSnapshot({
      schemaVersion: EVIDENCE_SCHEMA_VERSION,
      events,
      session: session ?? null,
    });
  };

  return {
    load,
    async append(event: EvidenceEvent) {
      assertOpen();
      const boundedEvent = cloneEvidenceEvent(event);
      const openedDatabase = await getDatabase();
      const transaction = openedDatabase.transaction(EVENT_STORE, "readwrite");
      const existingEvent = await transaction.store.get(boundedEvent.id);

      if (existingEvent === undefined) {
        await transaction.store.add(boundedEvent);
      }

      await transaction.done;
      return load();
    },
    async saveSession(session: PersistedMissionSession) {
      assertOpen();
      const boundedSession = clonePersistedMissionSession(session);
      const openedDatabase = await getDatabase();
      const transaction = openedDatabase.transaction(SESSION_STORE, "readwrite");
      await transaction.store.put(boundedSession, ACTIVE_SESSION_KEY);
      await transaction.done;
    },
    async export() {
      assertOpen();
      return createEvidenceExport(await load(), now);
    },
    async reset() {
      assertOpen();
      const openedDatabase = await getDatabase();
      const transaction = openedDatabase.transaction(
        [EVENT_STORE, SESSION_STORE],
        "readwrite",
      );
      await Promise.all([
        transaction.objectStore(EVENT_STORE).clear(),
        transaction.objectStore(SESSION_STORE).clear(),
      ]);
      await transaction.done;
    },
    close() {
      if (closed) {
        return;
      }

      closed = true;
      database?.close();
      database = null;

      const pendingDatabase = databasePromise;
      databasePromise = null;

      if (pendingDatabase) {
        void pendingDatabase.then(
          (openedDatabase) => openedDatabase.close(),
          () => undefined,
        );
      }
    },
  };
}

function assertDatabaseShape(
  database: IDBPDatabase<MissionShellEvidenceDatabase>,
): void {
  if (
    !database.objectStoreNames.contains(EVENT_STORE) ||
    !database.objectStoreNames.contains(SESSION_STORE)
  ) {
    database.close();
    throw new Error(
      `EvidenceStore database is not compatible with schema version ${EVIDENCE_DATABASE_VERSION}.`,
    );
  }

  const transaction = database.transaction(EVENT_STORE, "readonly");

  if (!transaction.store.indexNames.contains(EVENT_ORDER_INDEX)) {
    database.close();
    throw new Error(
      `EvidenceStore database is missing the ${EVENT_ORDER_INDEX} schema index.`,
    );
  }
}

function describeOpenFailure(error: unknown, databaseName: string): Error {
  if (
    typeof DOMException !== "undefined" &&
    error instanceof DOMException &&
    error.name === "VersionError"
  ) {
    return new Error(
      `EvidenceStore ${databaseName} uses a newer schema than version ${EVIDENCE_DATABASE_VERSION}.`,
      { cause: error },
    );
  }

  return error instanceof Error
    ? error
    : new Error(`EvidenceStore ${databaseName} could not be opened.`, {
        cause: error,
      });
}
