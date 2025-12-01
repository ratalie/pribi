const DB_NAME = "probo-registros-msw";
const DB_VERSION = 1;

const STORE_SCHEMAS = {
  sociedades: { keyPath: "idSociety" },
  datosSociedad: { keyPath: "idSociety" },
  quorumConfig: { keyPath: "id" },
  accionistas: { keyPath: "id" },
  apoderadosClases: { keyPath: "id" },
  apoderadosRegistro: { keyPath: "id" },
  juntas: { keyPath: "id" },
  "agenda-items": { keyPath: "id" },
} as const;

type StoreName = keyof typeof STORE_SCHEMAS;

const memoryStores = new Map<StoreName, Map<string, unknown>>();

function hasIndexedDB(): boolean {
  return typeof indexedDB !== "undefined";
}

function getMemoryStore(storeName: StoreName): Map<string, unknown> {
  if (!memoryStores.has(storeName)) {
    memoryStores.set(storeName, new Map());
  }
  return memoryStores.get(storeName)!;
}

async function openDatabase(): Promise<IDBDatabase | null> {
  if (!hasIndexedDB()) {
    return null;
  }

  return new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, DB_VERSION);

    request.onupgradeneeded = () => {
      const db = request.result;
      for (const [storeName, config] of Object.entries(STORE_SCHEMAS) as Array<
        [StoreName, { keyPath: string }]
      >) {
        if (!db.objectStoreNames.contains(storeName)) {
          db.createObjectStore(storeName, { keyPath: config.keyPath });
        }
      }
    };

    request.onsuccess = () => {
      resolve(request.result);
    };

    request.onerror = () => {
      reject(request.error ?? new Error("No se pudo abrir la base de datos de mocks."));
    };
  });
}

export async function getAllRecords<T>(storeName: StoreName): Promise<T[]> {
  const db = await openDatabase();
  if (!db) {
    const store = getMemoryStore(storeName);
    return Array.from(store.values()) as T[];
  }

  return new Promise((resolve, reject) => {
    const transaction = db.transaction(storeName, "readonly");
    const store = transaction.objectStore(storeName);
    const request = store.getAll();

    request.onsuccess = () => resolve(request.result as T[]);
    request.onerror = () =>
      reject(request.error ?? new Error(`No se pudieron obtener registros de ${storeName}`));

    transaction.oncomplete = () => db.close();
  });
}

export async function getRecord<T>(storeName: StoreName, id: string): Promise<T | null> {
  const db = await openDatabase();
  if (!db) {
    const store = getMemoryStore(storeName);
    return (store.get(id) as T) ?? null;
  }

  return new Promise((resolve, reject) => {
    const transaction = db.transaction(storeName, "readonly");
    const store = transaction.objectStore(storeName);
    const request = store.get(id);

    request.onsuccess = () => resolve((request.result as T) ?? null);
    request.onerror = () =>
      reject(
        request.error ?? new Error(`No se pudo obtener el registro ${id} de ${storeName}`)
      );

    transaction.oncomplete = () => db.close();
  });
}

export async function putRecord<T>(storeName: StoreName, value: T): Promise<T> {
  const db = await openDatabase();
  const keyPath = STORE_SCHEMAS[storeName].keyPath as keyof T;
  const key = String((value as any)[keyPath]);

  if (!db) {
    getMemoryStore(storeName).set(key, structuredClone(value) as unknown);
    return value;
  }

  return new Promise((resolve, reject) => {
    const transaction = db.transaction(storeName, "readwrite");
    const store = transaction.objectStore(storeName);
    const request = store.put(value as any);

    request.onsuccess = () => resolve(value);
    request.onerror = () =>
      reject(request.error ?? new Error(`No se pudo guardar el registro en ${storeName}`));

    transaction.oncomplete = () => db.close();
  });
}

export async function deleteRecord(storeName: StoreName, id: string): Promise<boolean> {
  const db = await openDatabase();
  if (!db) {
    const store = getMemoryStore(storeName);
    return store.delete(id);
  }

  return new Promise((resolve, reject) => {
    const transaction = db.transaction(storeName, "readwrite");
    const store = transaction.objectStore(storeName);
    const request = store.delete(id);

    request.onsuccess = () => resolve(true);
    request.onerror = () =>
      reject(
        request.error ?? new Error(`No se pudo eliminar el registro ${id} de ${storeName}`)
      );

    transaction.oncomplete = () => db.close();
  });
}

export async function clearStore(storeName: StoreName): Promise<void> {
  const db = await openDatabase();
  if (!db) {
    getMemoryStore(storeName).clear();
    return;
  }

  return new Promise((resolve, reject) => {
    const transaction = db.transaction(storeName, "readwrite");
    const store = transaction.objectStore(storeName);
    const request = store.clear();

    request.onsuccess = () => resolve();
    request.onerror = () =>
      reject(request.error ?? new Error(`No se pudo limpiar el store ${storeName}`));

    transaction.oncomplete = () => db.close();
  });
}

/**
 * Limpia todos los stores de mock (útil para tests)
 */
export async function clearAllMockData(): Promise<void> {
  const storeNames = Object.keys(STORE_SCHEMAS) as StoreName[];
  await Promise.all(storeNames.map((storeName) => clearStore(storeName)));
}
