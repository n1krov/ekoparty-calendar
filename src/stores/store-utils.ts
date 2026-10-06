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

export type Stores = Readable<any> | [Readable<any>, ...Array<Readable<any>>] | Array<Readable<any>>;

export type StoresValues<T> = T extends Readable<infer U>
  ? U
  : { [K in keyof T]: T[K] extends Readable<infer U> ? U : never };

export function derived<S, T>(
  stores: S,
  fn: (values: StoresValues<S>) => T
): Readable<T> {
  const isArray = Array.isArray(stores);
  const storeArray: Readable<any>[] = isArray
    ? (stores as unknown as Readable<any>[])
    : [stores as unknown as Readable<any>];

  return {
    subscribe(run: (value: T) => void): () => void {
      const values: any[] = new Array(storeArray.length);
      let started = false;

      const sync = () => {
        if (!started) return;
        const res = isArray ? fn(values as any) : fn(values[0] as any);
        run(res);
      };

      const unsubs = storeArray.map((s, idx) =>
        s.subscribe((val) => {
          values[idx] = val;
          if (started) {
            sync();
          }
        })
      );

      started = true;
      sync();

      return () => {
        unsubs.forEach((u) => u && u());
      };
    },
  };
}
