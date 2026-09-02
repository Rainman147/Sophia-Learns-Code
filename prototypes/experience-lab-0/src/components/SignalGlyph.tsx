import type { CaseState } from "../experience/model";

interface SignalGlyphProps {
  state: CaseState;
  compact?: boolean;
}

export function SignalGlyph({ state, compact = false }: SignalGlyphProps) {
  const stateLabel =
    state.signal === "verified"
      ? "Verified evidence channel"
      : state.signal === "contact"
        ? "Console contact established"
        : "Unresolved midnight signal";

  return (
    <svg
      className={`signal-glyph${compact ? " signal-glyph--compact" : ""}`}
      viewBox="0 0 320 240"
      role="img"
      aria-labelledby="signal-title signal-description"
    >
      <title id="signal-title">{stateLabel}</title>
      <desc id="signal-description">
        A synthetic midnight badge record connected to an Investigation Console.
        The labeled state is {state.signal}.
      </desc>
      <defs>
        <linearGradient id="beam" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0" stopColor="var(--signal-muted)" />
          <stop offset="1" stopColor="var(--signal-active)" />
        </linearGradient>
      </defs>
      <path className="signal-grid" d="M28 54H292M28 120H292M28 186H292" />
      <path className="signal-grid" d="M66 28V212M160 28V212M254 28V212" />
      <path className="signal-path" d="M70 164C116 164 120 76 172 76S224 138 270 138" />
      <circle className="signal-node signal-node--source" cx="70" cy="164" r="14" />
      <circle className="signal-node signal-node--event" cx="172" cy="76" r="14" />
      <circle className="signal-node signal-node--case" cx="270" cy="138" r="18" />
      <path className="badge-mark" d="M261 131h18v14h-18zM266 127v-5h8v5" />
      <text className="signal-label" x="42" y="194">SOURCE</text>
      <text className="signal-label" x="145" y="50">EVENT</text>
      <text className="signal-label" x="242" y="176">CASE</text>
      <g className={`signal-state signal-state--${state.signal}`}>
        <rect x="102" y="204" width="116" height="24" rx="12" />
        <text x="160" y="220" textAnchor="middle">
          {state.signal.toUpperCase()}
        </text>
      </g>
    </svg>
  );
}
