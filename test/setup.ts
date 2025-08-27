// Polyfill minimal window & localStorage for Bun test (node env)
class MemoryStorage implements Storage {
  private store: Record<string, string> = {};
  get length(): number { return Object.keys(this.store).length; }
  clear(): void { this.store = {}; }
  getItem(key: string): string | null { return Object.prototype.hasOwnProperty.call(this.store, key) ? this.store[key] : null; }
  key(index: number): string | null { return Object.keys(this.store)[index] ?? null; }
  removeItem(key: string): void { delete this.store[key]; }
  setItem(key: string, value: string): void { this.store[key] = String(value); }
}

// @ts-expect-error define global window for tests
if (typeof (globalThis as unknown as { window?: unknown }).window === "undefined") {
  // @ts-expect-error assign window for tests
  (globalThis as unknown as { window: { localStorage: Storage } }).window = { localStorage: new MemoryStorage() };
}

// Also expose localStorage at global for convenience
// @ts-expect-error define localStorage for tests
if (typeof (globalThis as unknown as { localStorage?: unknown }).localStorage === "undefined") {
  // @ts-expect-error assign localStorage for tests
  (globalThis as unknown as { localStorage: Storage }).localStorage = (globalThis as unknown as { window: { localStorage: Storage } }).window.localStorage;
}
