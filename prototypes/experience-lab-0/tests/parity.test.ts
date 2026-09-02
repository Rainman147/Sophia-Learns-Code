import { describe, expect, it } from "vitest";
import {
  CONTROL_VARIABLES,
  FIRST_CONTACT,
  getMissionDefinition,
  VARIANT_SHELLS,
} from "../src/experience/mission";
import { completeMission } from "./journey";

describe("controlled comparison parity", () => {
  it("uses the exact same Mission definition object for both variants", () => {
    expect(getMissionDefinition("direct")).toBe(FIRST_CONTACT);
    expect(getMissionDefinition("operations-center")).toBe(FIRST_CONTACT);
    expect(CONTROL_VARIABLES.stageOrder).toBe(FIRST_CONTACT.stageOrder);
    expect(CONTROL_VARIABLES.feedbackWording).toBe(
      "Goal · Observed · Clue · Next Action",
    );
  });

  it("limits variant configuration differences to route and entry/exit shell", () => {
    expect(VARIANT_SHELLS.direct.entry).toBe("mission");
    expect(VARIANT_SHELLS.direct.exit).toBe("direct-complete");
    expect(VARIANT_SHELLS["operations-center"].entry).toBe("hub-before");
    expect(VARIANT_SHELLS["operations-center"].exit).toBe("hub-after");
  });

  it("produces equivalent Mission evidence, feedback result, and Case state", () => {
    const direct = completeMission("direct");
    const hub = completeMission("operations-center");

    expect(hub.stage).toBe(direct.stage);
    expect(hub.source).toBe(direct.source);
    expect(hub.execution).toEqual(direct.execution);
    expect(hub.caseState).toEqual(direct.caseState);
    expect(hub.evidence).toEqual(direct.evidence);
    expect(hub.events.map(({ name, label }) => ({ name, label }))).toEqual(
      direct.events.map(({ name, label }) => ({ name, label })),
    );
  });
});
