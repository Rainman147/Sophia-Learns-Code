export function monotonicNow(): number {
  return typeof performance === "undefined" ? Date.now() : performance.now();
}
export function nonNegativeDuration(startedAt: number, finishedAt = monotonicNow()): number {
  return Math.max(0, finishedAt - startedAt);
}

export function delay(milliseconds: number): Promise<void> {
  return new Promise((resolve) => {
    setTimeout(resolve, Math.max(0, milliseconds));
  });
}

export function abortError(): Error {
  if (typeof DOMException !== "undefined") {
    return new DOMException("Runtime initialization was aborted.", "AbortError");
  }

  const error = new Error("Runtime initialization was aborted.");
  error.name = "AbortError";
  return error;
}

export async function waitWithAbort<T>(promise: Promise<T>, signal?: AbortSignal): Promise<T> {
  if (signal === undefined) {
    return promise;
  }

  if (signal.aborted) {
    throw abortError();
  }

  return new Promise<T>((resolve, reject) => {
    const onAbort = (): void => {
      signal.removeEventListener("abort", onAbort);
      reject(abortError());
    };

    signal.addEventListener("abort", onAbort, { once: true });
    void promise.then(
      (value) => {
        signal.removeEventListener("abort", onAbort);
        resolve(value);
      },
      (error: unknown) => {
        signal.removeEventListener("abort", onAbort);
        reject(error);
      },
    );
  });
}
