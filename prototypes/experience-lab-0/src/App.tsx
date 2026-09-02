import { Experience } from "./components/Experience";
import { CONTROL_VARIABLES, VARIANT_SHELLS } from "./experience/mission";
import type { Variant } from "./experience/model";

export function variantFromRoute(route: string): Variant | undefined {
  if (route === "/direct" || route.startsWith("/direct/")) return "direct";
  if (route === "/operations-center" || route.startsWith("/operations-center/")) {
    return "operations-center";
  }
  return undefined;
}

function ComparisonHome() {
  return (
    <main className="comparison-home">
      <div className="comparison-home__glow" aria-hidden="true" />
      <header>
        <span className="comparison-home__mark" aria-hidden="true">S</span>
        <p className="eyebrow">GitHub issue #22 · Experience Lab 0</p>
        <h1>Compare one Mission with one controlled difference.</h1>
        <p>
          Both routes contain the same complete First Contact experience. Only the
          Operations Center entry and return boundary changes.
        </p>
      </header>
      <section className="comparison-question" aria-labelledby="comparison-question-title">
        <p className="eyebrow">Product question</p>
        <h2 id="comparison-question-title">
          Does a restrained persistent Operations Center earn its navigation,
          visual, authoring, and engineering cost?
        </h2>
      </section>
      <div className="variant-choice-grid">
        <a className="variant-choice" href={VARIANT_SHELLS.direct.route}>
          <span className="variant-choice__index">A</span>
          <p className="eyebrow">Direct entry</p>
          <h2>First Contact immediately</h2>
          <p>Enter the Mission now; finish at a compact capability panel.</p>
          <strong>Open Variant A <span aria-hidden="true">→</span></strong>
        </a>
        <a className="variant-choice" href={VARIANT_SHELLS["operations-center"].route}>
          <span className="variant-choice__index">B</span>
          <p className="eyebrow">Hub boundary</p>
          <h2>Operations Center + First Contact</h2>
          <p>See one Case, tool, possibility, and recommendation before the same Mission.</p>
          <strong>Open Variant B <span aria-hidden="true">→</span></strong>
        </a>
      </div>
      <section className="control-ledger" aria-labelledby="control-ledger-title">
        <p className="eyebrow">Held equivalent</p>
        <h2 id="control-ledger-title">Shared comparison controls</h2>
        <ul>
          <li>{CONTROL_VARIABLES.learningObjective}</li>
          <li>Identical source tasks, feedback wording, Field Test, and evidence.</li>
          <li>Identical accessibility support, visual system, and Mission state sequence.</li>
        </ul>
      </section>
      <p className="home-truth-note">
        Scripted product prototype · synthetic Case data · not a real Python runtime ·
        not production architecture
      </p>
    </main>
  );
}

export function PrototypeApp({ route }: { route: string }) {
  const variant = variantFromRoute(route);
  return variant ? <Experience variant={variant} /> : <ComparisonHome />;
}

export default function App() {
  return <PrototypeApp route={window.location.pathname} />;
}
