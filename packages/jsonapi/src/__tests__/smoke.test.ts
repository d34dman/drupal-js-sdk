import { JsonApiEntityAdapter } from "..";
import {
  EntityAdapterContext,
  StorageInterface,
  StorageRecordInterface,
  StorageValueType,
  XhrInterface,
  XhrResponse,
  XhrRequestConfig,
} from "@drupal-js-sdk/interfaces";
import { DrupalErrorInterface } from "@drupal-js-sdk/interfaces";

class MemoryStorage implements StorageInterface {
  private store: StorageRecordInterface = {};
  getItem(keyName: string): StorageValueType { return this.store[keyName]; }
  setItem(keyName: string, keyValue: StorageValueType): void { this.store[keyName] = keyValue; }
  removeItem(keyName: string): void { delete this.store[keyName]; }
  clear(): void { this.store = {}; }
  getString(keyName: string): string | null {
    const value = this.getItem(keyName);
    return typeof value === "string" ? value : null;
  }
  setString(keyName: string, keyValue: string): void { this.setItem(keyName, keyValue); }
  isAvailable(): boolean { return true; }
  get(): StorageRecordInterface | null { return { ...this.store }; }
  set(value: StorageRecordInterface): void { this.store = { ...value }; }
}

class StubClient implements XhrInterface {
  setClient(_client: unknown): XhrInterface { return this; }
  getClient(): unknown { return null; }
  addDefaultHeaders(_headers: { [key: string]: unknown; }): XhrInterface { return this; }
  getDrupalError(_response: unknown): DrupalErrorInterface {
    return {
      name: "StubDrupalError",
      message: "",
      code: 0,
      getErrorCode(): number { return 0; },
      stack: undefined,
    };
  }
  async call<T = unknown, D = unknown>(method: string, path: string, config?: { [key: string]: unknown; }): Promise<XhrResponse<T, D>> {
    const data = {
      data: {
        id: "1",
        type: "node--article",
        attributes: { title: "Hello" },
      }
    } as unknown as T;
    return {
      data,
      status: 200,
      statusText: "OK",
      headers: {},
      config: ({ method, url: path, ...config } as unknown) as XhrRequestConfig<D>,
    };
  }
}

test("JsonApiEntityAdapter smoke", async () => {
  const ctx: EntityAdapterContext = {
    id: { entity: "node", bundle: "article" },
    basePath: "/jsonapi/node/article",
    client: new StubClient(),
    config: new MemoryStorage(),
  };
  const adapter = new JsonApiEntityAdapter<{ title: string }>(ctx);
  const record = await adapter.load("1");
  expect(record.id).toBe("1");
  expect(record.type).toBe("node--article");
  expect(record.attributes.title).toBe("Hello");
});


