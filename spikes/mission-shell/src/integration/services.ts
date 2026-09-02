import type {
  EvidenceStore,
  ExecutionRuntime,
  MissionActor,
  MissionEvaluator,
  SceneRenderer,
} from "../contracts";

export interface MissionShellServices {
  readonly actor: MissionActor;
  readonly runtime: ExecutionRuntime;
  readonly evaluator: MissionEvaluator;
  readonly sceneRenderer: SceneRenderer;
  readonly evidenceStore: EvidenceStore;
}

// Root integration owns concrete composition. Workstreams implement only these ports.
export type MissionShellServiceFactory = () => MissionShellServices;
