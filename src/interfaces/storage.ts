export interface StorageInterface {

    /**
     * When passed a key name, will return that key's value.
     */
    getItem(keyName: string): any;

    /**
     * When passed a key name and value, will add that key to the storage,
     * or update that key's value if it already exists.
     */
    setItem(keyName: string, keyValue: any): boolean;

    /**
     * When passed a key name, will remove that key from the storage.
     */
    removeItem(keyName: string): boolean;

    /**
     * When invoked, will empty all keys out of the storage.
     */
    clear(): boolean;
}
