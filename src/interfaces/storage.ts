
export type StorageKeyType = string;
export type StorageValueType = boolean | number | string | {[key: string]: any;} | undefined;

export interface StorageInterface {

    /**
     * When passed a key name, will return that key's value.
     */
    getItem(keyName: StorageKeyType): StorageValueType;

    /**
     * When passed a key name and value, will add that key to the storage,
     * or update that key's value if it already exists.
     */
    setItem(keyName: StorageKeyType, keyValue: StorageValueType): boolean;

    /**
     * When passed a key name, will remove that key from the storage.
     */
    removeItem(keyName: StorageKeyType): boolean;

    /**
     * When invoked, will empty all keys out of the storage.
     */
    clear(): boolean;
}
