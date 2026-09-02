export function utf8ByteLength(value: string): number {
  return new TextEncoder().encode(value).byteLength;
}
export function truncateToUtf8Bytes(value: string, maximumBytes: number): string {
  if (maximumBytes <= 0) {
    return "";
  }

  const encoder = new TextEncoder();
  let bytes = 0;
  let result = "";

  for (const character of value) {
    const characterBytes = encoder.encode(character).byteLength;
    if (bytes + characterBytes > maximumBytes) {
      break;
    }
    result += character;
    bytes += characterBytes;
  }

  return result;
}

export class BoundedOutputCapture {
  readonly #maximumBytes: number;
  #outputBytes = 0;
  #stdout = "";
  #stderr = "";
  #exceeded = false;

  constructor(maximumBytes: number) {
    this.#maximumBytes = maximumBytes;
  }

  get stdout(): string {
    return this.#stdout;
  }

  get stderr(): string {
    return this.#stderr;
  }

  get outputBytes(): number {
    return this.#outputBytes;
  }

  get exceeded(): boolean {
    return this.#exceeded;
  }

  appendStdout(value: string): void {
    this.#stdout += this.#takeBounded(value);
  }

  appendStderr(value: string): void {
    this.#stderr += this.#takeBounded(value);
  }

  #takeBounded(value: string): string {
    const remainingBytes = this.#maximumBytes - this.#outputBytes;
    const boundedValue = truncateToUtf8Bytes(value, remainingBytes);
    const acceptedBytes = utf8ByteLength(boundedValue);
    this.#outputBytes += acceptedBytes;

    if (acceptedBytes < utf8ByteLength(value)) {
      this.#exceeded = true;
    }

    return boundedValue;
  }
}
