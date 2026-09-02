import { useEffect, useRef } from "react";

export function ResetDialog({
  open,
  onCancel,
  onConfirm,
}: {
  open: boolean;
  onCancel: () => void;
  onConfirm: () => void;
}) {
  const cancelRef = useRef<HTMLButtonElement>(null);
  const confirmRef = useRef<HTMLButtonElement>(null);

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
          if (event.key === "Tab" && event.shiftKey && document.activeElement === cancelRef.current) {
            event.preventDefault();
            confirmRef.current?.focus();
          } else if (event.key === "Tab" && !event.shiftKey && document.activeElement === confirmRef.current) {
            event.preventDefault();
            cancelRef.current?.focus();
          }
        }}
      >
        <p className="dialog-label">Deliberate reset</p>
        <h2 id="reset-title">Reset this route?</h2>
        <p id="reset-description">
          This removes saved progress for the current entry route. The other two
          routes stay unchanged.
        </p>
        <div className="button-row">
          <button className="button button--quiet" onClick={onCancel} ref={cancelRef}>
            Keep my place
          </button>
          <button className="button button--primary" onClick={onConfirm} ref={confirmRef}>
            Reset route
          </button>
        </div>
      </section>
    </div>
  );
}
