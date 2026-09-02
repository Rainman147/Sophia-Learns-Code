import Link from "next/link";

export default function ComparisonIndex() {
  return (
    <main style={{ margin: "0 auto", maxWidth: 760, padding: "8rem 1.5rem" }}>
      <p>Architecture spike · issues #22 and #26</p>
      <h1>First Contact controlled comparison</h1>
      <p>Choose either matched entry route. No winner is implied by route order.</p>
      <nav aria-label="Prototype variants" style={{ display: "flex", flexWrap: "wrap", gap: 16 }}>
        <Link href="/direct/">Variant A · Direct Mission</Link>
        <Link href="/operations/">Variant B · Operations Center + Mission</Link>
      </nav>
    </main>
  );
}
