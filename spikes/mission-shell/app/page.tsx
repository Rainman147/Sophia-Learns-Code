import Link from "next/link";
import styles from "./index.module.css";

export default function ComparisonIndex() {
  return (
    <main className={styles.page}>
      <div className={styles.grid} aria-hidden="true" />
      <header className={styles.header}>
        <div className={styles.lockup}>
          <span aria-hidden="true">S</span>
          <div>
            <small>Python Investigator</small>
            <strong>Mission Shell Spike</strong>
          </div>
        </div>
        <span className={styles.badge}>Issues #22 + #26 · controlled prototype</span>
      </header>

      <section className={styles.hero} aria-labelledby="comparison-title">
        <p className={styles.eyebrow}>First Contact · owner comparison package</p>
        <h1 id="comparison-title">Same Mission.<br />Two entry paths.</h1>
        <p className={styles.lede}>
          Compare direct Mission entry with a restrained Operations Center. Learning content, Python task, feedback,
          evidence, accessibility, and visual quality remain matched. The hub is the principal variable.
        </p>
      </section>

      <section className={styles.variants} aria-label="Choose a controlled variant">
        <article>
          <div className={styles.variantIndex}>A</div>
          <p className={styles.eyebrow}>Direct Mission</p>
          <h2>Start with the first meaningful code action.</h2>
          <p>A compact Case cold open leads directly into First Contact and ends with capability evidence and a clean choice.</p>
          <Link href="/direct/">Open Variant A <span aria-hidden="true">→</span></Link>
        </article>
        <article>
          <div className={styles.variantIndex}>B</div>
          <p className={styles.eyebrow}>Operations Center + Mission</p>
          <h2>See the Case, tool, and locked possibility first.</h2>
          <p>A restrained hub frames First Contact, then visibly changes when the same Mission and evidence are complete.</p>
          <Link href="/operations/">Open Variant B <span aria-hidden="true">→</span></Link>
        </article>
      </section>

      <section className={styles.controls} aria-labelledby="controls-title">
        <div>
          <p className={styles.eyebrow}>Experimental discipline</p>
          <h2 id="controls-title">What remains controlled</h2>
        </div>
        <ul>
          <li>One shared First Contact definition and Mission actor</li>
          <li>One real Pyodide worker and deterministic evaluator</li>
          <li>Identical code, story facts, feedback, and evidence</li>
          <li>Identical keyboard, status, and reduced-motion paths</li>
          <li>No winner selected and no production architecture declared</li>
        </ul>
      </section>

      <footer className={styles.footer}>
        <p>Architecture spike · synthetic local state · no backend or analytics</p>
        <p>Use <code>?runtime=scripted</code> for the deterministic review route.</p>
      </footer>
    </main>
  );
}
