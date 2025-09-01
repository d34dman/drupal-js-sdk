/**
 * @file Interface validation tests for @drupal-js-sdk/interfaces
 * 
 * This file contains tests that validate TypeScript interfaces by ensuring
 * that example objects properly implement the interface contracts. While
 * interfaces themselves don't produce executable code coverage, these tests
 * ensure the interfaces are well-defined and usable.
 */

import {
  // Core interfaces
  CoreInterface,
  
  // XHR interfaces  
  XhrInterface,
  XhrResponse,
  XhrRequestConfig,
  XhrQueryParams,
  XhrMethod,
  
  // Storage interfaces
  StorageInterface,
  StorageValueType,
  StorageRecordInterface,
  
  // Entity interfaces
  EntityIdentifier,
  EntityAttributes,
  EntityRecord,
  EntityLoadOptions,
  EntityListOptions,
  EntityPageInfo,
  EntityListResult,
  EntityAdapterContext,
  EntityAdapter,
  EntityAdapterFactory,
  
  // Error interfaces
  DrupalErrorInterface,
  
  // Session interfaces  
  SessionInterface,
  
  // Client interfaces
  ClientInterface,
} from "..";

describe("Interface Type Validation", () => {
  describe("Core Interfaces", () => {
    test("CoreInterface should be properly defined", () => {
      const mockStorage: StorageInterface = {
        getItem: () => "test",
        setItem: () => {},
        removeItem: () => {},
        clear: () => {},
        getString: () => "test",
        setString: () => {},
        isAvailable: () => true,
        get: () => ({}),
        set: () => {},
      };

      const mockXhr: XhrInterface = {
        setClient: () => mockXhr,
        getClient: () => null,
        addDefaultOptions: () => mockXhr,
        addDefaultHeaders: () => mockXhr,
        getDrupalError: () => ({
          name: "Error",
          message: "Test error",
          code: 500,
          getErrorCode: () => 500,
        }),
        call: async () => ({
          data: {},
          status: 200,
          statusText: "OK",
          headers: {},
          config: {} as XhrRequestConfig,
        }),
      };

      const mockSession: SessionInterface = {
        getItem: () => "test",
        setItem: () => {},
        removeItem: () => {},
        clear: () => {},
        getString: () => "test", 
        setString: () => {},
        isAvailable: () => true,
        get: () => ({}),
        set: () => {},
      };

      const mockCore: CoreInterface = {
        config: mockStorage,
        getClientService: () => mockXhr,
        getConfigService: () => mockStorage,
        getSessionService: () => mockSession,
      };

      expect(mockCore.config).toBeDefined();
      expect(typeof mockCore.getClientService).toBe("function");
      expect(typeof mockCore.getConfigService).toBe("function");
      expect(typeof mockCore.getSessionService).toBe("function");
    });
  });

  describe("XHR Interfaces", () => {
    test("XhrInterface should support all required methods", () => {
      const mockXhr: XhrInterface = {
        setClient: (client) => {
          expect(client).toBeDefined();
          return mockXhr;
        },
        getClient: () => null,
        addDefaultOptions: (options) => {
          expect(typeof options).toBe("object");
          return mockXhr;
        },
        addDefaultHeaders: (headers) => {
          expect(typeof headers).toBe("object");
          return mockXhr;
        },
        getDrupalError: (response) => ({
          name: "TestError",
          message: "Test error message",
          code: 500,
          getErrorCode: () => 500,
        }),
        call: async (method, path, config) => {
          expect(typeof method).toBe("string");
          expect(typeof path).toBe("string");
          return {
            data: { test: "data" },
            status: 200,
            statusText: "OK",
            headers: { "content-type": "application/json" },
            config: config as XhrRequestConfig,
          };
        },
      };

      expect(typeof mockXhr.setClient).toBe("function");
      expect(typeof mockXhr.getClient).toBe("function");
      expect(typeof mockXhr.addDefaultOptions).toBe("function");
      expect(typeof mockXhr.addDefaultHeaders).toBe("function");
      expect(typeof mockXhr.getDrupalError).toBe("function");
      expect(typeof mockXhr.call).toBe("function");
    });

    test("XhrRequestConfig should support all configuration options", () => {
      const config: XhrRequestConfig = {
        method: "POST",
        baseURL: "https://api.example.com",
        url: "/test",
        headers: {
          "Content-Type": "application/json",
          "Authorization": "Bearer token123",
        },
        params: {
          page: 1,
          limit: 10,
        },
        data: {
          name: "test",
          value: 42,
        },
        timeoutMs: 5000,
        withCredentials: true,
        auth: {
          username: "user",
          password: "pass",
        },
      };

      expect(config.method).toBe("POST");
      expect(config.baseURL).toBe("https://api.example.com");
      expect(config.url).toBe("/test");
      expect(config.headers).toBeDefined();
      expect(config.params).toBeDefined();
      expect(config.data).toBeDefined();
      expect(config.timeoutMs).toBe(5000);
      expect(config.withCredentials).toBe(true);
      expect(config.auth).toBeDefined();
    });

    test("XhrResponse should contain all required properties", () => {
      const response: XhrResponse = {
        data: { id: 1, name: "test" },
        status: 200,
        statusText: "OK",
        headers: {
          "content-type": "application/json",
          "x-total-count": "100",
        },
        config: {
          method: "GET",
          url: "/api/test",
        } as XhrRequestConfig,
      };

      expect(response.data).toBeDefined();
      expect(response.status).toBe(200);
      expect(response.statusText).toBe("OK");
      expect(response.headers).toBeDefined();
      expect(response.config).toBeDefined();
    });

    test("XhrQueryParams should support various parameter types", () => {
      const params: XhrQueryParams = {
        stringParam: "value",
        numberParam: 42,
        booleanParam: true,
        arrayParam: ["a", "b", "c"],
        numberArrayParam: [1, 2, 3],
        booleanArrayParam: [true, false],
      };

      expect(params.stringParam).toBe("value");
      expect(params.numberParam).toBe(42);
      expect(params.booleanParam).toBe(true);
      expect(Array.isArray(params.arrayParam)).toBe(true);
      expect(Array.isArray(params.numberArrayParam)).toBe(true);
      expect(Array.isArray(params.booleanArrayParam)).toBe(true);
    });
  });

  describe("Storage Interfaces", () => {
    test("StorageInterface should support all storage operations", () => {
      const storage: StorageInterface = {
        getItem: (key) => {
          expect(typeof key).toBe("string");
          return "stored-value";
        },
        setItem: (key, value) => {
          expect(typeof key).toBe("string");
          expect(value).toBeDefined();
        },
        removeItem: (key) => {
          expect(typeof key).toBe("string");
        },
        clear: () => {
          // Clear all items
        },
        getString: (key) => {
          expect(typeof key).toBe("string");
          return "string-value";
        },
        setString: (key, value) => {
          expect(typeof key).toBe("string");
          expect(typeof value).toBe("string");
        },
        isAvailable: () => true,
        get: () => ({ key1: "value1", key2: 42 }),
        set: (value) => {
          expect(typeof value).toBe("object");
        },
      };

      expect(typeof storage.getItem).toBe("function");
      expect(typeof storage.setItem).toBe("function");
      expect(typeof storage.removeItem).toBe("function");
      expect(typeof storage.clear).toBe("function");
      expect(typeof storage.getString).toBe("function");
      expect(typeof storage.setString).toBe("function");
      expect(typeof storage.isAvailable).toBe("function");
      expect(typeof storage.get).toBe("function");
      expect(typeof storage.set).toBe("function");
    });

    test("StorageValueType should accept various value types", () => {
      const stringValue: StorageValueType = "test string";
      const numberValue: StorageValueType = 42;
      const booleanValue: StorageValueType = true;
      const objectValue: StorageValueType = { key: "value" };
      const arrayValue: StorageValueType = [1, 2, 3];
      const nullValue: StorageValueType = null;
      const undefinedValue: StorageValueType = undefined;

      expect(typeof stringValue).toBe("string");
      expect(typeof numberValue).toBe("number");
      expect(typeof booleanValue).toBe("boolean");
      expect(typeof objectValue).toBe("object");
      expect(Array.isArray(arrayValue)).toBe(true);
      expect(nullValue).toBeNull();
      expect(undefinedValue).toBeUndefined();
    });

    test("StorageRecordInterface should be a record of storage values", () => {
      const record: StorageRecordInterface = {
        stringKey: "string value",
        numberKey: 123,
        booleanKey: false,
        objectKey: { nested: "object" },
        arrayKey: ["item1", "item2"],
        nullKey: null,
      };

      expect(record.stringKey).toBe("string value");
      expect(record.numberKey).toBe(123);
      expect(record.booleanKey).toBe(false);
      expect(typeof record.objectKey).toBe("object");
      expect(Array.isArray(record.arrayKey)).toBe(true);
      expect(record.nullKey).toBeNull();
    });
  });

  describe("Entity Interfaces", () => {
    test("EntityIdentifier should have entity and bundle", () => {
      const identifier: EntityIdentifier = {
        entity: "node",
        bundle: "article",
      };

      expect(identifier.entity).toBe("node");
      expect(identifier.bundle).toBe("article");
    });

    test("EntityAttributes should be a record of unknown values", () => {
      const attributes: EntityAttributes = {
        title: "Article Title",
        body: "Article body content",
        status: 1,
        published: true,
        tags: ["tag1", "tag2"],
        metadata: {
          author: "John Doe",
          created: "2023-01-01",
        },
      };

      expect(attributes.title).toBe("Article Title");
      expect(attributes.body).toBe("Article body content");
      expect(attributes.status).toBe(1);
      expect(attributes.published).toBe(true);
      expect(Array.isArray(attributes.tags)).toBe(true);
      expect(typeof attributes.metadata).toBe("object");
    });

    test("EntityRecord should contain all required properties", () => {
      interface ArticleAttributes extends EntityAttributes {
        title: string;
        body: string;
        status: number;
      }

      const record: EntityRecord<ArticleAttributes> = {
        id: "123",
        type: "node--article",
        attributes: {
          title: "Test Article",
          body: "Article content",
          status: 1,
        },
        relationships: {
          author: {
            data: { id: "456", type: "user--user" },
          },
          tags: {
            data: [
              { id: "1", type: "taxonomy_term--tags" },
              { id: "2", type: "taxonomy_term--tags" },
            ],
          },
        },
      };

      expect(record.id).toBe("123");
      expect(record.type).toBe("node--article");
      expect(record.attributes.title).toBe("Test Article");
      expect(record.relationships).toBeDefined();
    });

    test("EntityLoadOptions should support various loading options", () => {
      const options: EntityLoadOptions = {
        params: {
          include: "author,tags",
          "fields[node--article]": "title,body",
        },
        jsonapi: {
          query: {
            include: "author",
            "fields[node--article]": "title,body,status",
            "filter[status]": "1",
          },
        },
      };

      expect(options.params).toBeDefined();
      expect(options.jsonapi).toBeDefined();
      expect(options.jsonapi?.query).toBeDefined();
    });

    test("EntityListOptions should extend EntityLoadOptions", () => {
      const options: EntityListOptions = {
        params: {
          "page[limit]": 10,
          "page[offset]": 0,
        },
        jsonapi: {
          query: {
            "page[limit]": 10,
            "sort": "-created",
            "filter[status]": "1",
          },
        },
      };

      expect(options.params).toBeDefined();
      expect(options.jsonapi).toBeDefined();
    });

    test("EntityPageInfo should contain pagination metadata", () => {
      const pageInfo: EntityPageInfo = {
        size: 10,
        number: 1,
        total: 100,
        next: "/api/articles?page[number]=2",
        prev: null,
      };

      expect(pageInfo.size).toBe(10);
      expect(pageInfo.number).toBe(1);
      expect(pageInfo.total).toBe(100);
      expect(pageInfo.next).toBe("/api/articles?page[number]=2");
      expect(pageInfo.prev).toBeNull();
    });

    test("EntityListResult should contain items and optional page info", () => {
      interface ArticleAttributes extends EntityAttributes {
        title: string;
        body: string;
      }

      const result: EntityListResult<ArticleAttributes> = {
        items: [
          {
            id: "1",
            type: "node--article",
            attributes: { title: "Article 1", body: "Content 1" },
            relationships: {},
          },
          {
            id: "2",
            type: "node--article",
            attributes: { title: "Article 2", body: "Content 2" },
            relationships: {},
          },
        ],
        page: {
          size: 2,
          number: 1,
          total: 50,
          next: "/api/articles?page[number]=2",
          prev: null,
        },
      };

      expect(Array.isArray(result.items)).toBe(true);
      expect(result.items).toHaveLength(2);
      expect(result.page).toBeDefined();
      expect(result.page?.total).toBe(50);
    });

    test("EntityAdapterContext should provide required context", () => {
      const mockXhr: XhrInterface = {
        setClient: () => mockXhr,
        getClient: () => null,
        addDefaultOptions: () => mockXhr,
        addDefaultHeaders: () => mockXhr,
        getDrupalError: () => ({ name: "Error", message: "Test", code: 500, getErrorCode: () => 500 }),
        call: async () => ({ data: {}, status: 200, statusText: "OK", headers: {}, config: {} as XhrRequestConfig }),
      };

      const mockStorage: StorageInterface = {
        getItem: () => null,
        setItem: () => {},
        removeItem: () => {},
        clear: () => {},
        getString: () => null,
        setString: () => {},
        isAvailable: () => true,
        get: () => ({}),
        set: () => {},
      };

      const context: EntityAdapterContext = {
        id: { entity: "node", bundle: "article" },
        basePath: "/jsonapi/node/article",
        client: mockXhr,
        config: mockStorage,
      };

      expect(context.id).toBeDefined();
      expect(context.basePath).toBe("/jsonapi/node/article");
      expect(context.client).toBeDefined();
      expect(context.config).toBeDefined();
    });

    test("EntityAdapter should implement required methods", () => {
      interface TestAttributes extends EntityAttributes {
        title: string;
        body: string;
      }

      const adapter: EntityAdapter<TestAttributes> = {
        load: async (entityId, options) => {
          expect(typeof entityId).toBe("string");
          return {
            id: entityId,
            type: "node--article",
            attributes: { title: "Test", body: "Content" },
            relationships: {},
          };
        },
        list: async (options) => [
          {
            id: "1",
            type: "node--article",
            attributes: { title: "Test 1", body: "Content 1" },
            relationships: {},
          },
        ],
        count: async (options) => 42,
        listPage: async (options) => ({
          items: [
            {
              id: "1",
              type: "node--article",
              attributes: { title: "Test", body: "Content" },
              relationships: {},
            },
          ],
          page: { total: 1, size: 1, number: 1 },
        }),
      };

      expect(typeof adapter.load).toBe("function");
      expect(typeof adapter.list).toBe("function");
      expect(typeof adapter.count).toBe("function");
      expect(typeof adapter.listPage).toBe("function");
    });

    test("EntityAdapterFactory should be a function that returns EntityAdapter", () => {
      interface TestAttributes extends EntityAttributes {
        name: string;
        value: number;
      }

      const factory: EntityAdapterFactory<TestAttributes> = (context) => {
        expect(context).toBeDefined();
        expect(context.id).toBeDefined();
        expect(context.basePath).toBeDefined();
        expect(context.client).toBeDefined();

        return {
          load: async (entityId) => ({
            id: entityId,
            type: "test--entity",
            attributes: { name: "Test Entity", value: 42 },
            relationships: {},
          }),
        };
      };

      expect(typeof factory).toBe("function");
    });
  });

  describe("Error Interfaces", () => {
    test("DrupalErrorInterface should extend Error with additional properties", () => {
      const error: DrupalErrorInterface = {
        name: "DrupalApiError",
        message: "Invalid request parameters",
        code: 400,
        getErrorCode: () => 400,
      };

      expect(error.name).toBe("DrupalApiError");
      expect(error.message).toBe("Invalid request parameters");
      expect(error.code).toBe(400);
      expect(typeof error.getErrorCode).toBe("function");
      expect(error.getErrorCode()).toBe(400);
    });

    test("DrupalErrorInterface should work with different error codes", () => {
      const notFound: DrupalErrorInterface = {
        name: "NotFoundError",
        message: "Entity not found",
        code: 404,
        getErrorCode: () => 404,
      };

      const serverError: DrupalErrorInterface = {
        name: "ServerError",
        message: "Internal server error",
        code: 500,
        getErrorCode: () => 500,
      };

      expect(notFound.code).toBe(404);
      expect(serverError.code).toBe(500);
    });
  });

  describe("Session Interfaces", () => {
    test("SessionInterface should extend StorageInterface", () => {
      const session: SessionInterface = {
        getItem: (key) => `session-${key}`,
        setItem: (key, value) => {
          expect(typeof key).toBe("string");
          expect(value).toBeDefined();
        },
        removeItem: (key) => {
          expect(typeof key).toBe("string");
        },
        clear: () => {},
        getString: (key) => `session-string-${key}`,
        setString: (key, value) => {
          expect(typeof key).toBe("string");
          expect(typeof value).toBe("string");
        },
        isAvailable: () => true,
        get: () => ({ sessionData: "value" }),
        set: (value) => {
          expect(typeof value).toBe("object");
        },
      };

      expect(typeof session.getItem).toBe("function");
      expect(typeof session.setItem).toBe("function");
      expect(typeof session.removeItem).toBe("function");
      expect(typeof session.clear).toBe("function");
    });
  });

  describe("Client Interfaces", () => {
    test("ClientInterface should define client operations", () => {
      const client: ClientInterface = {
        client: { someClientImplementation: true },
        setClient: (newClient) => {
          expect(newClient).toBeDefined();
          return client;
        },
        getClient: () => client.client,
        call: async (method, path, config) => {
          expect(typeof method).toBe("string");
          expect(typeof path).toBe("string");
          return { data: "response" };
        },
        getDrupalError: (response) => ({
          name: "ClientError",
          message: "Client error occurred",
          code: 400,
          getErrorCode: () => 400,
        }),
        addDefaultHeaders: (headers) => {
          expect(typeof headers).toBe("object");
          return client;
        },
      };

      expect(client.client).toBeDefined();
      expect(typeof client.setClient).toBe("function");
      expect(typeof client.getClient).toBe("function");
      expect(typeof client.call).toBe("function");
      expect(typeof client.getDrupalError).toBe("function");
      expect(typeof client.addDefaultHeaders).toBe("function");
    });
  });

  describe("Type Unions and Enums", () => {
    test("XhrMethod type should accept valid HTTP methods", () => {
      const getMethods: XhrMethod[] = ["get", "GET"];
      const postMethods: XhrMethod[] = ["post", "POST"];
      const putMethods: XhrMethod[] = ["put", "PUT"];
      const patchMethods: XhrMethod[] = ["patch", "PATCH"];
      const deleteMethods: XhrMethod[] = ["delete", "DELETE"];

      expect(getMethods).toContain("get");
      expect(getMethods).toContain("GET");
      expect(postMethods).toContain("post");
      expect(postMethods).toContain("POST");
    });
  });

  describe("Optional Properties and Partial Types", () => {
    test("Should handle optional properties in EntityRecord", () => {
      const minimalRecord: EntityRecord = {
        id: "123",
        type: "node--article",
        attributes: { title: "Minimal Article" },
        // relationships is optional
      };

      expect(minimalRecord.relationships).toBeUndefined();
    });

    test("Should handle optional properties in EntityLoadOptions", () => {
      const minimalOptions: EntityLoadOptions = {};
      const optionsWithParams: EntityLoadOptions = {
        params: { include: "author" },
      };
      const optionsWithJsonapi: EntityLoadOptions = {
        jsonapi: { query: { include: "tags" } },
      };

      expect(minimalOptions.params).toBeUndefined();
      expect(optionsWithParams.params).toBeDefined();
      expect(optionsWithJsonapi.jsonapi).toBeDefined();
    });

    test("Should handle optional properties in XhrRequestConfig", () => {
      const minimalConfig: XhrRequestConfig = {};
      const configWithMethod: XhrRequestConfig = {
        method: "POST",
      };
      const fullConfig: XhrRequestConfig = {
        method: "POST",
        url: "/api/test",
        headers: { "Content-Type": "application/json" },
        data: { name: "test" },
      };

      expect(minimalConfig.method).toBeUndefined();
      expect(configWithMethod.method).toBe("POST");
      expect(fullConfig.url).toBe("/api/test");
    });
  });

  describe("Generic Type Support", () => {
    test("Should support generic types in EntityRecord", () => {
      interface CustomAttributes extends EntityAttributes {
        customField: string;
        customNumber: number;
        customArray: string[];
      }

      const customRecord: EntityRecord<CustomAttributes> = {
        id: "custom-123",
        type: "custom--entity",
        attributes: {
          customField: "custom value",
          customNumber: 42,
          customArray: ["item1", "item2"],
        },
      };

      expect(customRecord.attributes.customField).toBe("custom value");
      expect(customRecord.attributes.customNumber).toBe(42);
      expect(Array.isArray(customRecord.attributes.customArray)).toBe(true);
    });

    test("Should support generic types in XhrResponse", () => {
      interface ApiResponse {
        success: boolean;
        data: {
          id: number;
          name: string;
        };
      }

      const response: XhrResponse<ApiResponse> = {
        data: {
          success: true,
          data: {
            id: 1,
            name: "Test Entity",
          },
        },
        status: 200,
        statusText: "OK",
        headers: {},
        config: {} as XhrRequestConfig,
      };

      expect(response.data.success).toBe(true);
      expect(response.data.data.id).toBe(1);
      expect(response.data.data.name).toBe("Test Entity");
    });
  });
});
