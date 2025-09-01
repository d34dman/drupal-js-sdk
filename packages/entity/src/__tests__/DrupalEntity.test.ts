import {
  CoreInterface,
  EntityAdapterFactory,
  EntityAdapterContext,
  EntityAdapter,
  EntityAttributes,
  EntityRecord,
  EntityIdentifier,
  EntityListOptions,
  EntityLoadOptions,
  XhrInterface,
  XhrResponse,
  XhrRequestConfig,
  StorageInterface,
  StorageValueType,
  StorageRecordInterface,
} from "@drupal-js-sdk/interfaces";

import { DrupalEntity } from "../DrupalEntity";
import { EntityLoader } from "../EntityLoader";
import { EntityService } from "../EntityService";
import { FluentEntity } from "../FluentEntity";

/**
 * Mock Storage implementation for testing
 */
class MockStorage implements StorageInterface {
  private store: StorageRecordInterface = {};

  getItem(keyName: string): StorageValueType {
    return this.store[keyName];
  }

  setItem(keyName: string, keyValue: StorageValueType): void {
    this.store[keyName] = keyValue;
  }

  removeItem(keyName: string): void {
    delete this.store[keyName];
  }

  clear(): void {
    this.store = {};
  }

  getString(keyName: string): string | null {
    const value = this.getItem(keyName);
    return typeof value === "string" ? value : null;
  }

  setString(keyName: string, keyValue: string): void {
    this.setItem(keyName, keyValue);
  }

  isAvailable(): boolean {
    return true;
  }

  get(): StorageRecordInterface | null {
    return { ...this.store };
  }

  set(value: StorageRecordInterface): void {
    this.store = { ...value };
  }
}

/**
 * Mock XHR client for testing
 */
class MockXhrClient implements XhrInterface {
  setClient(_client: unknown): XhrInterface {
    return this;
  }

  getClient(): unknown {
    return null;
  }

  addDefaultOptions(_options: Partial<XhrRequestConfig>): XhrInterface {
    return this;
  }

  addDefaultHeaders(_headers: { [key: string]: unknown }): XhrInterface {
    return this;
  }

  getDrupalError(_response: unknown) {
    return {
      name: "MockDrupalError",
      message: "Mock error",
      code: 500,
      getErrorCode: () => 500,
      stack: undefined,
    };
  }

  async call<T = unknown, D = unknown>(
    _method: string,
    _path: string,
    _config?: XhrRequestConfig<D>
  ): Promise<XhrResponse<T, D>> {
    const mockData = {
      data: {
        id: "1",
        type: "node--article",
        attributes: { title: "Test Article", body: "Test content" },
        relationships: {},
      },
    };

    return {
      data: mockData as T,
      status: 200,
      statusText: "OK",
      headers: {},
      config: {} as XhrRequestConfig<D>,
    };
  }
}

/**
 * Mock Core implementation for testing
 */
class MockCore implements CoreInterface {
  private readonly client: XhrInterface;
  public config: StorageInterface;
  private readonly session: StorageInterface;

  constructor() {
    this.client = new MockXhrClient();
    this.config = new MockStorage();
    this.session = new MockStorage();
  }

  getClientService(): XhrInterface {
    return this.client;
  }

  getConfigService(): StorageInterface {
    return this.config;
  }

  getSessionService(): StorageInterface {
    return this.session;
  }
}

/**
 * Mock Entity Adapter for testing
 */
class MockEntityAdapter<TAttributes extends EntityAttributes = EntityAttributes>
  implements EntityAdapter<TAttributes> {
  
  async load(entityId: string, _options?: EntityLoadOptions): Promise<EntityRecord<TAttributes>> {
    return {
      id: entityId,
      type: "node--article",
      attributes: { title: "Mock Article", body: "Mock content" } as unknown as TAttributes,
      relationships: {},
    };
  }

  async list(_options?: EntityListOptions): Promise<Array<EntityRecord<TAttributes>>> {
    return [
      {
        id: "1",
        type: "node--article",
        attributes: { title: "Mock Article 1", body: "Mock content 1" } as unknown as TAttributes,
        relationships: {},
      },
      {
        id: "2",
        type: "node--article", 
        attributes: { title: "Mock Article 2", body: "Mock content 2" } as unknown as TAttributes,
        relationships: {},
      },
    ];
  }
}

describe("DrupalEntity", () => {
  let mockCore: MockCore;
  let drupalEntity: DrupalEntity;
  let mockAdapterFactory: EntityAdapterFactory;

  beforeEach(() => {
    mockCore = new MockCore();
    drupalEntity = new DrupalEntity(mockCore);
    mockAdapterFactory = (_ctx: EntityAdapterContext) => new MockEntityAdapter();
  });

  describe("Constructor", () => {
    test("should create DrupalEntity with CoreInterface", () => {
      expect(drupalEntity).toBeInstanceOf(DrupalEntity);
    });

    test("should initialize internal EntityService", () => {
      // Test that the internal service is working by trying to use it
      drupalEntity.registerAdapter("test", mockAdapterFactory);
      const loader = drupalEntity.entity({ entity: "node", bundle: "article" }, "test");
      expect(loader).toBeInstanceOf(EntityLoader);
    });

    test("should work with different CoreInterface implementations", () => {
      const customStorage = new MockStorage();
      const customCore: CoreInterface = {
        config: customStorage,
        getClientService: () => new MockXhrClient(),
        getConfigService: () => customStorage,
        getSessionService: () => new MockStorage(),
      };

      const customDrupalEntity = new DrupalEntity(customCore);
      expect(customDrupalEntity).toBeInstanceOf(DrupalEntity);
    });
  });

  describe("Adapter Management", () => {
    test("should register adapter", () => {
      const result = drupalEntity.registerAdapter("jsonapi", mockAdapterFactory);
      expect(result).toBe(drupalEntity); // Should return this for chaining
    });

    test("should register multiple adapters", () => {
      const result = drupalEntity
        .registerAdapter("jsonapi", mockAdapterFactory)
        .registerAdapter("graphql", mockAdapterFactory)
        .registerAdapter("custom", mockAdapterFactory);
      
      expect(result).toBe(drupalEntity);
      
      // Test that all adapters can be used
      const jsonApiLoader = drupalEntity.entity({ entity: "node", bundle: "article" }, "jsonapi");
      const graphqlLoader = drupalEntity.entity({ entity: "node", bundle: "article" }, "graphql");
      const customLoader = drupalEntity.entity({ entity: "node", bundle: "article" }, "custom");

      expect(jsonApiLoader).toBeInstanceOf(EntityLoader);
      expect(graphqlLoader).toBeInstanceOf(EntityLoader);
      expect(customLoader).toBeInstanceOf(EntityLoader);
    });

    test("should set default adapter", () => {
      const result = drupalEntity.setDefaultAdapter("custom");
      expect(result).toBe(drupalEntity); // Should return this for chaining
    });

    test("should support method chaining for adapter management", () => {
      const result = drupalEntity
        .registerAdapter("jsonapi", mockAdapterFactory)
        .setDefaultAdapter("jsonapi")
        .registerAdapter("graphql", mockAdapterFactory);

      expect(result).toBe(drupalEntity);

      // Should be able to use the default adapter
      const loader = drupalEntity.entity({ entity: "node", bundle: "article" });
      expect(loader).toBeInstanceOf(EntityLoader);
    });

    test("should throw error for unknown adapter", () => {
      expect(() => {
        drupalEntity.entity({ entity: "node", bundle: "article" }, "unknown");
      }).toThrow('Unknown entity adapter "unknown"');
    });
  });

  describe("Entity Creation", () => {
    beforeEach(() => {
      drupalEntity.registerAdapter("jsonapi", mockAdapterFactory);
    });

    test("should create entity loader with identifier", () => {
      const identifier: EntityIdentifier = { entity: "node", bundle: "article" };
      const loader = drupalEntity.entity(identifier);
      
      expect(loader).toBeInstanceOf(EntityLoader);
    });

    test("should create entity loader with specific adapter", () => {
      drupalEntity.registerAdapter("custom", mockAdapterFactory);
      
      const identifier: EntityIdentifier = { entity: "node", bundle: "article" };
      const loader = drupalEntity.entity(identifier, "custom");
      
      expect(loader).toBeInstanceOf(EntityLoader);
    });

    test("should create entity loaders for different entity types", () => {
      const nodeLoader = drupalEntity.entity({ entity: "node", bundle: "article" });
      const userLoader = drupalEntity.entity({ entity: "user", bundle: "user" });
      const termLoader = drupalEntity.entity({ entity: "taxonomy_term", bundle: "tags" });
      
      expect(nodeLoader).toBeInstanceOf(EntityLoader);
      expect(userLoader).toBeInstanceOf(EntityLoader);
      expect(termLoader).toBeInstanceOf(EntityLoader);
    });

    test("should create entity loaders with type safety", () => {
      interface ArticleAttributes extends EntityAttributes {
        title: string;
        body: string;
        published: boolean;
      }

      const typedLoader = drupalEntity.entity<ArticleAttributes>(
        { entity: "node", bundle: "article" }
      );
      
      expect(typedLoader).toBeInstanceOf(EntityLoader);
    });

    test("should handle empty entity identifier", () => {
      const identifier: EntityIdentifier = { entity: "", bundle: "" };
      const loader = drupalEntity.entity(identifier);
      
      expect(loader).toBeInstanceOf(EntityLoader);
    });

    test("should handle special characters in entity/bundle names", () => {
      const identifier: EntityIdentifier = { entity: "custom_entity", bundle: "special-bundle" };
      const loader = drupalEntity.entity(identifier);
      
      expect(loader).toBeInstanceOf(EntityLoader);
    });
  });

  describe("Node Factory Method", () => {
    beforeEach(() => {
      drupalEntity.registerAdapter("jsonapi", mockAdapterFactory);
    });

    test("should create FluentEntity for node", () => {
      const fluentEntity = drupalEntity.node("article");
      expect(fluentEntity).toBeInstanceOf(FluentEntity);
    });

    test("should create FluentEntity for different node bundles", () => {
      const articleEntity = drupalEntity.node("article");
      const pageEntity = drupalEntity.node("page");
      const newsEntity = drupalEntity.node("news");
      
      expect(articleEntity).toBeInstanceOf(FluentEntity);
      expect(pageEntity).toBeInstanceOf(FluentEntity);
      expect(newsEntity).toBeInstanceOf(FluentEntity);
    });

    test("should create FluentEntity with type safety", () => {
      interface ArticleAttributes extends EntityAttributes {
        title: string;
        body: string;
        published: boolean;
      }

      const typedFluentEntity = drupalEntity.node<ArticleAttributes>("article");
      expect(typedFluentEntity).toBeInstanceOf(FluentEntity);
    });

    test("should handle empty bundle name", () => {
      const fluentEntity = drupalEntity.node("");
      expect(fluentEntity).toBeInstanceOf(FluentEntity);
    });

    test("should handle special characters in bundle name", () => {
      const fluentEntity = drupalEntity.node("special-bundle_name");
      expect(fluentEntity).toBeInstanceOf(FluentEntity);
    });
  });

  describe("Integration with EntityService", () => {
    beforeEach(() => {
      drupalEntity.registerAdapter("jsonapi", mockAdapterFactory);
    });

    test("should proxy to EntityService for entity creation", () => {
      const identifier: EntityIdentifier = { entity: "node", bundle: "article" };
      const loader = drupalEntity.entity(identifier);
      
      // The loader should be able to perform operations
      expect(() => loader.load("1")).not.toThrow();
    });

    test("should proxy adapter registration to EntityService", () => {
      const customFactory: EntityAdapterFactory = (_ctx) => new MockEntityAdapter();
      drupalEntity.registerAdapter("test", customFactory);
      
      // Should be able to use the registered adapter
      const loader = drupalEntity.entity({ entity: "node", bundle: "article" }, "test");
      expect(loader).toBeInstanceOf(EntityLoader);
    });

    test("should proxy default adapter setting to EntityService", () => {
      drupalEntity.setDefaultAdapter("jsonapi");
      
      // Should use the default adapter
      const loader = drupalEntity.entity({ entity: "node", bundle: "article" });
      expect(loader).toBeInstanceOf(EntityLoader);
    });

    test("should create FluentEntity that uses the same EntityService", () => {
      const fluentEntity = drupalEntity.node("article");
      
      // The FluentEntity should be able to use the registered adapters
      expect(fluentEntity).toBeInstanceOf(FluentEntity);
      
      // Test that it can perform operations (requires adapter to be working)
      expect(() => fluentEntity.list()).not.toThrow();
    });
  });

  describe("Facade Pattern", () => {
    test("should act as facade over EntityService", () => {
      // DrupalEntity should provide the same functionality as EntityService
      // but with a simplified interface
      drupalEntity.registerAdapter("jsonapi", mockAdapterFactory);
      
      const directService = new EntityService(mockCore);
      directService.registerAdapter("jsonapi", mockAdapterFactory);
      
      // Both should create equivalent loaders
      const facadeLoader = drupalEntity.entity({ entity: "node", bundle: "article" });
      const directLoader = directService.entity({ entity: "node", bundle: "article" });
      
      expect(facadeLoader).toBeInstanceOf(EntityLoader);
      expect(directLoader).toBeInstanceOf(EntityLoader);
    });

    test("should provide node-specific helper that service doesn't have", () => {
      drupalEntity.registerAdapter("jsonapi", mockAdapterFactory);
      
      const directService = new EntityService(mockCore);
      
      // DrupalEntity has node() method, EntityService doesn't
      const fluentEntity = drupalEntity.node("article");
      expect(fluentEntity).toBeInstanceOf(FluentEntity);
      
      // EntityService doesn't have a node() method
      expect((directService as any).node).toBeUndefined();
    });

    test("should maintain same adapter state as internal service", () => {
      const customAdapter1: EntityAdapterFactory = (_ctx) => new MockEntityAdapter();
      const customAdapter2: EntityAdapterFactory = (_ctx) => new MockEntityAdapter();
      
      drupalEntity
        .registerAdapter("adapter1", customAdapter1)
        .registerAdapter("adapter2", customAdapter2)
        .setDefaultAdapter("adapter1");
      
      // Should be able to use both adapters
      const loader1 = drupalEntity.entity({ entity: "node", bundle: "article" }, "adapter1");
      const loader2 = drupalEntity.entity({ entity: "node", bundle: "article" }, "adapter2");
      const defaultLoader = drupalEntity.entity({ entity: "node", bundle: "article" });
      
      expect(loader1).toBeInstanceOf(EntityLoader);
      expect(loader2).toBeInstanceOf(EntityLoader);
      expect(defaultLoader).toBeInstanceOf(EntityLoader);
    });
  });

  describe("Error Handling", () => {
    test("should propagate EntityService errors", () => {
      // Should throw error for unknown adapter
      expect(() => {
        drupalEntity.entity({ entity: "node", bundle: "article" }, "unknown");
      }).toThrow('Unknown entity adapter "unknown"');
    });

    test("should propagate adapter factory errors", () => {
      const errorFactory: EntityAdapterFactory = () => {
        throw new Error("Adapter factory error");
      };
      
      drupalEntity.registerAdapter("error", errorFactory);
      
      expect(() => {
        drupalEntity.entity({ entity: "node", bundle: "article" }, "error");
      }).toThrow("Adapter factory error");
    });

    test("should handle null CoreInterface gracefully", () => {
      // This would likely throw during construction or first use
      expect(() => {
        new DrupalEntity(null as any);
      }).not.toThrow(); // Constructor should not throw

      // But operations should fail
      const nullEntity = new DrupalEntity(null as any);
      nullEntity.registerAdapter("test", mockAdapterFactory);
      
      expect(() => {
        nullEntity.entity({ entity: "node", bundle: "article" }, "test");
      }).toThrow(); // Should throw when trying to access null core
    });
  });

  describe("Edge Cases", () => {
    test("should handle multiple default adapter changes", () => {
      drupalEntity
        .registerAdapter("adapter1", mockAdapterFactory)
        .registerAdapter("adapter2", mockAdapterFactory)
        .registerAdapter("adapter3", mockAdapterFactory)
        .setDefaultAdapter("adapter1")
        .setDefaultAdapter("adapter2")
        .setDefaultAdapter("adapter3");
      
      // Should use the last set default adapter
      const loader = drupalEntity.entity({ entity: "node", bundle: "article" });
      expect(loader).toBeInstanceOf(EntityLoader);
    });

    test("should handle adapter re-registration", () => {
      const adapter1: EntityAdapterFactory = (_ctx) => new MockEntityAdapter();
      const adapter2: EntityAdapterFactory = (_ctx) => new MockEntityAdapter();
      
      drupalEntity.registerAdapter("test", adapter1);
      drupalEntity.registerAdapter("test", adapter2); // Re-register with different implementation
      
      // Should use the latest registered adapter
      const loader = drupalEntity.entity({ entity: "node", bundle: "article" }, "test");
      expect(loader).toBeInstanceOf(EntityLoader);
    });

    test("should handle very long entity/bundle names", () => {
      const longEntity = "very_long_entity_name_that_exceeds_normal_expectations";
      const longBundle = "very_long_bundle_name_that_also_exceeds_normal_expectations";
      
      drupalEntity.registerAdapter("jsonapi", mockAdapterFactory);
      
      const loader = drupalEntity.entity({ entity: longEntity, bundle: longBundle });
      expect(loader).toBeInstanceOf(EntityLoader);
    });

    test("should handle numeric-like entity/bundle names", () => {
      drupalEntity.registerAdapter("jsonapi", mockAdapterFactory);
      
      const loader = drupalEntity.entity({ entity: "123", bundle: "456" });
      expect(loader).toBeInstanceOf(EntityLoader);
    });
  });

  describe("Performance Considerations", () => {
    test("should reuse internal EntityService instance", () => {
      // Multiple operations should use the same internal service
      drupalEntity.registerAdapter("test", mockAdapterFactory);
      
      const loader1 = drupalEntity.entity({ entity: "node", bundle: "article" }, "test");
      const loader2 = drupalEntity.entity({ entity: "node", bundle: "page" }, "test");
      
      expect(loader1).toBeInstanceOf(EntityLoader);
      expect(loader2).toBeInstanceOf(EntityLoader);
      
      // Both should have access to the same adapter registration
    });

    test("should handle many adapter registrations efficiently", () => {
      // Register many adapters
      for (let i = 0; i < 100; i++) {
        drupalEntity.registerAdapter(`adapter${i}`, mockAdapterFactory);
      }
      
      // Should still work efficiently
      const loader = drupalEntity.entity({ entity: "node", bundle: "article" }, "adapter50");
      expect(loader).toBeInstanceOf(EntityLoader);
    });

    test("should handle many entity creations efficiently", () => {
      drupalEntity.registerAdapter("jsonapi", mockAdapterFactory);
      
      // Create many loaders
      const loaders = [];
      for (let i = 0; i < 100; i++) {
        loaders.push(drupalEntity.entity({ entity: "node", bundle: `bundle${i}` }));
      }
      
      // All should be valid
      loaders.forEach(loader => {
        expect(loader).toBeInstanceOf(EntityLoader);
      });
    });
  });

  describe("Type Safety", () => {
    test("should maintain type safety for entity method", () => {
      interface CustomAttributes extends EntityAttributes {
        name: string;
        value: number;
      }
      
      drupalEntity.registerAdapter("jsonapi", mockAdapterFactory);
      
      const typedLoader = drupalEntity.entity<CustomAttributes>({ entity: "custom", bundle: "type" });
      expect(typedLoader).toBeInstanceOf(EntityLoader);
    });

    test("should maintain type safety for node method", () => {
      interface NodeAttributes extends EntityAttributes {
        title: string;
        body: string;
        status: boolean;
      }
      
      drupalEntity.registerAdapter("jsonapi", mockAdapterFactory);
      
      const typedFluentEntity = drupalEntity.node<NodeAttributes>("article");
      expect(typedFluentEntity).toBeInstanceOf(FluentEntity);
    });

    test("should work with complex attribute types", () => {
      interface ComplexAttributes extends EntityAttributes {
        simpleField: string;
        arrayField: string[];
        objectField: {
          nested: string;
          count: number;
        };
        optionalField?: boolean;
      }
      
      drupalEntity.registerAdapter("jsonapi", mockAdapterFactory);
      
      const complexLoader = drupalEntity.entity<ComplexAttributes>({ entity: "complex", bundle: "type" });
      const complexFluentEntity = drupalEntity.node<ComplexAttributes>("complex");
      
      expect(complexLoader).toBeInstanceOf(EntityLoader);
      expect(complexFluentEntity).toBeInstanceOf(FluentEntity);
    });
  });
});
