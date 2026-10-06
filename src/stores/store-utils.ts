/**
 * Implementación desacoplada y sin dependencias del contrato de Stores de Svelte.
 * Permite tipado y ejecución garantizados en cualquier entorno sin depender
 * de la descarga de node_modules.
 */

export interface Readable<T> {
  subscribe(run: (value: T) => void): () => void;
}

export interface Writable<T> extends Readable<T> {
  set(value: T): void;
  update(updater: (value: T) => T): void;
}

export function writable<T>(initialValue: T): Writable<T> {
  let value = initialValue;
  const subscribers = new Set<(value: T) => void>();

  return {
    subscribe(fn: (value: T) => void): () => void {
      subscribers.add(fn);
      fn(value);
      return () => {
        subscribers.delete(fn);
      };
    },
    set(newValue: T): void {
      value = newValue;
      subscribers.forEach((fn) => fn(value));
    },
    update(updater: (value: T) => T): void {
      this.set(updater(value));
    },
  };
}

export function derived<S, T>(
  store: Readable<S>,
  fn: (value: S) => T
): Readable<T> {
  return {
    subscribe(run: (value: T) => void): () => void {
      return store.subscribe((storeVal) => {
        run(fn(storeVal));
      });
    },
  };
}

export function derivedMulti<T>(
  stores: Readable<unknown>[],
  fn: (values: unknown[]) => T
): Readable<T> {
  return {
    subscribe(run: (value: T) => void): () => void {
      const values: unknown[] = new Array(stores.length);
      let initialized = 0;
      const unsubs = stores.map((s, idx) =>
        s.subscribe((val) => {
          values[idx] = val;
          if (initialized < stores.length) initialized++;
          if (initialized >= stores.length) {
            run(fn(values));
          }
        })
      );

      return () => {
        unsubs.forEach((u) => u());
      };
    },
  };
}
