
export type StorageValueType = any;

export interface StorageRecordInterface {
  [id: string]: StorageValueType;
}

export interface StorageInterface {

    /**
     * When passed a key name, will return that key's value.
     */
    getItem(keyName: string): StorageValueType;

    /**
     * When passed a key name and value, will add that key to the storage,
     * or update that key's value if it already exists.
     */
    setItem(keyName: string, keyValue: StorageValueType): void;

    /**
     * When passed a key name, will remove that key from the storage.
     */
    removeItem(keyName: string): void;

    /**
     * When invoked, will empty all keys out of the storage.
     */
    clear(): void;

    /**
     * When passed a key name, will return that key's value.
     */
    getString(keyName: string): string | null;

     /**
      * When passed a key name and value, will add that key to the storage,
      * or update that key's value if it already exists.
      */
    setString(keyName: string, keyValue: string): void;
    
    /**
     * Check if storage is available.
     */
    isAvailable(): boolean;

    /**
     * Retrieve entire data.
     */
    get(): StorageRecordInterface | null;

    /**
     * Replace entire data.
     */
    set(value: StorageRecordInterface): void;
}
