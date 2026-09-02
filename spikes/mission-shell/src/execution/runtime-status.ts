import type { RuntimeStatus, Unsubscribe } from "@/src/contracts";

export type RuntimeStatusObserver = (status: Readonly<RuntimeStatus>) => void;

export class RuntimeStatusTracker {
  readonly #listeners = new Set<(status: RuntimeStatus) => void>();
  readonly #observer: RuntimeStatusObserver | undefined;
  #status: RuntimeStatus;

  constructor(initialStatus: RuntimeStatus, observer?: RuntimeStatusObserver) {
    this.#status = Object.freeze({ ...initialStatus });
    this.#observer = observer;
    this.#notifyObserver(this.#status);
  }

  get(): RuntimeStatus {
    return this.#status;
  }

  set(status: RuntimeStatus): void {
    this.#status = Object.freeze({ ...status });
    this.#notifyObserver(this.#status);

    for (const listener of this.#listeners) {
      try {
        listener(this.#status);
      } catch {
        // Runtime state must not be corrupted by a read-only observer.
      }
    }
  }

  subscribe(listener: (status: RuntimeStatus) => void): Unsubscribe {
    this.#listeners.add(listener);
    try {
      listener(this.#status);
    } catch {
      // Subscription is observational and cannot interrupt the runtime.
    }

    return () => {
      this.#listeners.delete(listener);
    };
  }

  clear(): void {
    this.#listeners.clear();
  }

  #notifyObserver(status: RuntimeStatus): void {
    try {
      this.#observer?.(status);
    } catch {
      // The optional observer is deliberately read-only and isolated.
    }
  }
}
