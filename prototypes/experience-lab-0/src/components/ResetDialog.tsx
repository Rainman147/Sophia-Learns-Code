import { useEffect, useRef } from "react";

interface ResetDialogProps {
  open: boolean;
  onCancel: () => void;
  onConfirm: () => void;
}

export function ResetDialog({ open, onCancel, onConfirm }: ResetDialogProps) {
  const cancelRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (open) cancelRef.current?.focus();
  }, [open]);

  if (!open) return null;

  return (
    <div className="dialog-backdrop" role="presentation">
      <section
        className="reset-dialog"
        role="alertdialog"
        aria-modal="true"
        aria-labelledby="reset-title"
        aria-describedby="reset-description"
        onKeyDown={(event) => {
          if (event.key === "Escape") onCancel();
        }}
      >
        <p className="eyebrow">Deliberate reset</p>
        <h2 id="reset-title">Reset this variant?</h2>
        <p id="reset-description">
          This removes the locally saved state for this variant and returns it to
          its original entry point. The other variant is not changed.
        </p>
        <div className="button-row">
          <button className="button button--quiet" onClick={onCancel} ref={cancelRef}>
            Keep my state
          </button>
          <button className="button button--danger" onClick={onConfirm}>
            Reset variant
          </button>
        </div>
      </section>
    </div>
  );
}
