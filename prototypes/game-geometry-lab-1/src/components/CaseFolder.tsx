import { useId } from "react";
import type { CaseState } from "../experience/model";

export function CaseFolder({
  caseState,
  emphasized = false,
}: {
  caseState: CaseState;
  emphasized?: boolean;
}) {
  const titleId = useId();
  const descriptionId = useId();
  const open = caseState.folder === "open";

  return (
    <figure
      className="case-folder"
      data-folder-state={caseState.folder}
      data-emphasized={emphasized || undefined}
    >
      <svg
        viewBox="0 0 260 178"
        role="img"
        aria-labelledby={`${titleId} ${descriptionId}`}
      >
        <title id={titleId}>{open ? "Open First Contact Case folder" : "Sealed First Contact Case folder"}</title>
        <desc id={descriptionId}>
          {open
            ? "The folder is open and the newest program result is marked as changed evidence."
            : "The folder is sealed and waiting for the first successful program result."}
        </desc>
        <path className="folder-back" d="M22 48h84l17-20h115v126H22z" />
        <path className="folder-paper" d="M43 51h174v94H43z" />
        <path className="folder-line" d="M63 76h112M63 95h132M63 114h86" />
        <path className="folder-front" d="M17 67h226l-16 89H33z" />
        <path className="folder-seal" d="M112 98h36v36h-36z" />
        <text x="130" y="120" textAnchor="middle">001</text>
      </svg>
      <figcaption>
        <span>Case object</span>
        <strong>{open ? "First Contact file open" : "First Contact file sealed"}</strong>
        <small>{open ? caseState.headline : "Waiting for a program result"}</small>
      </figcaption>
    </figure>
  );
}
