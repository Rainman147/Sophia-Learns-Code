import type { CaseState, TaskResult } from "./case";
import type { MissionStage } from "./mission";
import type { ExperienceVariant, IsoTimestamp, RevisionedSource, RuntimeMode } from "./shared";

export interface EvidenceEvent {
  readonly id: string;
  readonly type: "evidence_recorded";
  readonly occurredAt: IsoTimestamp;
  readonly missionId: string;
  readonly missionVersion: string;
  readonly taskResult: TaskResult;
  readonly runtimeMode: RuntimeMode;
  readonly supportLevel: "full" | "guided" | "none";
  readonly privacy: "local-synthetic";
}

export interface PersistedMissionSession extends RevisionedSource {
  readonly schemaVersion: 1;
  readonly missionId: string;
  readonly missionVersion: string;
  readonly variant: ExperienceVariant;
  readonly stage: MissionStage;
  readonly runtimeMode: RuntimeMode;
  readonly caseState: CaseState;
  readonly updatedAt: IsoTimestamp;
}

export interface EvidenceSnapshot {
  readonly schemaVersion: 1;
  readonly events: readonly EvidenceEvent[];
  readonly session: PersistedMissionSession | null;
}

export interface EvidenceExport {
  readonly exportedAt: IsoTimestamp;
  readonly description: "Synthetic local mission-shell spike evidence";
  readonly snapshot: EvidenceSnapshot;
}

export interface EvidenceStore {
  load(): Promise<EvidenceSnapshot>;
  append(event: EvidenceEvent): Promise<EvidenceSnapshot>;
  saveSession(session: PersistedMissionSession): Promise<void>;
  export(): Promise<EvidenceExport>;
  reset(): Promise<void>;
  close(): void;
}
