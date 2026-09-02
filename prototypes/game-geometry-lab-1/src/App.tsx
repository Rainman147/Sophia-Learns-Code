import { Experience } from "./components/Experience";
import {
  CAUSALITY_LEVELS,
  CONTROL_VARIABLES,
  VARIANT_GEOMETRIES,
} from "./experience/mission";
import type { CausalityLevel, EntryVariant } from "./experience/model";

export function variantFromRoute(route: string): EntryVariant | undefined {
  if (route === "/direct" || route.startsWith("/direct/")) return "direct";
  if (route === "/hub-first" || route.startsWith("/hub-first/")) {
    return "hub-first";
  }
  if (route === "/earned-hub" || route.startsWith("/earned-hub/")) {
    return "earned-hub";
  }
  return undefined;
}

export function causalityFromSearch(search: string): CausalityLevel {
  const level = new URLSearchParams(search).get("causality");
  return level === "a" || level === "b" || level === "c" ? level : "c";
}

function ComparisonHome() {
  return (
    <main className="comparison-home">
      <header className="comparison-heading">
        <p className="reviewer-kicker">Game Geometry Lab 1 · Owner comparison</p>
        <h1>One Mission. Three ways in. Three ways to show cause.</h1>
        <p>
          This research surface is outside the learner experience. Each route uses
          the same First Contact Mission and differs only at its entry and completion
          boundary.
        </p>
      </header>

      <section className="comparison-question" aria-labelledby="question-heading">
        <h2 id="question-heading">Question under review</h2>
        <p>
          What is the smallest shape that feels like a flowing mystery game powered
          by code, while keeping place, consequence, and next action clear?
        </p>
      </section>

      <section className="route-comparison" aria-labelledby="routes-heading">
        <div className="section-heading">
          <h2 id="routes-heading">Entry geometry</h2>
          <p>Open each route with causality level C, then change that level in the reviewer controls.</p>
        </div>
        <div className="route-list">
          {Object.values(VARIANT_GEOMETRIES).map((variant, index) => (
            <a
              className="route-row"
              href={`${variant.route}?causality=c`}
              key={variant.variant}
            >
              <span className="route-row__index">{String(index + 1).padStart(2, "0")}</span>
              <span>
                <strong>{variant.label}</strong>
                <small>
                  {variant.variant === "direct"
                    ? "Case cold open → Mission → compact boundary"
                    : variant.variant === "hub-first"
                      ? "Operations Center → Mission → changed Center"
                      : "Case cold open → Mission → earned Center reveal"}
                </small>
              </span>
              <span aria-hidden="true">Open →</span>
            </a>
          ))}
        </div>
      </section>

      <section className="control-record" aria-labelledby="controls-heading">
        <div className="section-heading">
          <h2 id="controls-heading">Held equivalent</h2>
        </div>
        <dl>
          <div>
            <dt>Mission rhythm</dt>
            <dd>{CONTROL_VARIABLES.content.beats.map((beat) => beat.label).join(" → ")}</dd>
          </div>
          <div>
            <dt>Learning and evidence</dt>
            <dd>{CONTROL_VARIABLES.capabilityEvidence}; {CONTROL_VARIABLES.reward}</dd>
          </div>
          <div>
            <dt>Causality treatments</dt>
            <dd>{Object.values(CAUSALITY_LEVELS).map((level) => level.label).join(" · ")}</dd>
          </div>
          <div>
            <dt>Boundary</dt>
            <dd>Scripted evaluator, synthetic Case data, disposable prototype.</dd>
          </div>
        </dl>
      </section>
    </main>
  );
}

export function PrototypeApp({
  route,
  search = "",
}: {
  route: string;
  search?: string;
}) {
  const variant = variantFromRoute(route);
  const causality = causalityFromSearch(search);
  return variant ? (
    <Experience variant={variant} initialCausality={causality} />
  ) : (
    <ComparisonHome />
  );
}

export default function App() {
  return (
    <PrototypeApp
      route={window.location.pathname}
      search={window.location.search}
    />
  );
}
