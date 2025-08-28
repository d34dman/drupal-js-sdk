import { EntityService } from "..";
import { JsonApiEntityAdapter } from "@drupal-js-sdk/jsonapi";
import {
  CoreInterface,
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
  private headers: Record<string, unknown> = {};
  setClient(_client: unknown): XhrInterface { return this; }
  getClient(): unknown { return null; }
  addDefaultHeaders(headers: { [key: string]: unknown; }): XhrInterface {
    this.headers = { ...this.headers, ...headers };
    return this;
  }
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
    // Minimal JSON:API-like response
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

class StubCore implements CoreInterface {
  public config: StorageInterface;
  private client: XhrInterface;
  constructor(client: XhrInterface) {
    this.client = client;
    this.config = new MemoryStorage();
  }
  getClientService(): XhrInterface { return this.client; }
  getConfigService(): StorageInterface { return this.config; }
}

test("EntityService + JsonApiEntityAdapter smoke", async () => {
  const client = new StubClient();
  const core = new StubCore(client);
  const svc = new EntityService(core);

  // Explicit opt-in
  svc.registerAdapter("jsonapi", (ctx) => new JsonApiEntityAdapter(ctx));

  const loader = svc.entity<{ title: string }>({ entity: "node", bundle: "article" }, "jsonapi");
  const record = await loader.load("1");

  expect(record.id).toBe("1");
  expect(record.type).toBe("node--article");
  expect(record.attributes.title).toBe("Hello");
});


