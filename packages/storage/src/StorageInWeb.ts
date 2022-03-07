import { DrupalError } from "@drupal-js-sdk/error";

import { StorageInterface, StorageRecordInterface, StorageValueType } from "./interfaces";

interface WebStorageInterface {
    getItem(key: string): string | null;
    setItem(key: string, value: string): void;
    removeItem(key: string): void;
    clear(): void;
}


export class StorageInWeb implements StorageInterface {

    private readonly storage: WebStorageInterface;
    
    public constructor(getStorage = (): WebStorageInterface => window.localStorage) {
        this.storage = getStorage();
        if (this.isAvailable() === false) {
            throw new DrupalError(DrupalError.STORAGE_IN_WEB_FAIL, 'Storage is not available.');
        }
    }

    public getString(keyName: string): string | null {
        return this.storage.getItem(keyName);
    }

    public setString(keyName: string, keyValue: string): void {
        this.storage.setItem(keyName, keyValue);
    }

    public isAvailable(): boolean {
        try {
            const test_string = "__test_data_used_for_checking_strorage__";
            this.setString(test_string, test_string);
            const isAvailable = this.getString(test_string) === test_string;
            this.removeItem(test_string);
            return isAvailable;
        } catch (e) {
            return false;
        }
    }

    /**
     * When passed a key name, will return that key's value.
     */
    public getItem(keyName: string): StorageValueType {
        const value = this.getString(keyName);
        return (value !== null) ? JSON.parse(value) : null;
    }

    /**
     * When passed a key name and value, will add that key to the storage,
     * or update that key's value if it already exists.
     */
    public setItem(keyName: string, keyValue: StorageValueType): void {
        const encodedValue = JSON.stringify(keyValue);
        this.setString(keyName, encodedValue);
    }

    /**
     * When passed a key name, will remove that key from the storage.
     */
    public removeItem(keyName: string): void {
        return this.storage.removeItem(keyName);
    }

    /**
     * When invoked, will empty all keys out of the storage.
     */
    public clear(): void {
        this.storage.clear();
    }

    public get(): StorageRecordInterface {
        throw new Error('Not possible to use "get" in WebStorage context.');
    }

    public set(data: StorageRecordInterface): void {
        throw new Error('Not possible to use "set" in WebStorage context.');
    }
}
