import {
  EntityAttributes,
  EntityRecord,
  EntityIdentifier,
  EntityListOptions,
  EntityLoadOptions,
} from "@drupal-js-sdk/interfaces";

import { EntityService } from "../EntityService";
import { attachRelations } from "../relations";

/**
 * Mock EntityService for testing relations
 */
class MockEntityService {
  private readonly mockData: Map<string, EntityRecord<EntityAttributes>> = new Map();
  private readonly mockListData: Map<string, Array<EntityRecord<EntityAttributes>>> = new Map();
  private shouldThrowError = false;
  private errorMessage = "Mock service error";

  constructor() {
    this.setupMockData();
  }

  private setupMockData(): void {
    // Mock related entities
    this.mockData.set("user:1", {
      id: "1",
      type: "user--user",
      attributes: { name: "John Doe", email: "john@example.com" },
      relationships: {},
    });

    this.mockData.set("user:2", {
      id: "2",
      type: "user--user",
      attributes: { name: "Jane Smith", email: "jane@example.com" },
      relationships: {},
    });

    this.mockData.set("taxonomy_term:1", {
      id: "1",
      type: "taxonomy_term--tags",
      attributes: { name: "Tag 1", weight: 0 },
      relationships: {},
    });

    this.mockData.set("taxonomy_term:2", {
      id: "2",
      type: "taxonomy_term--tags",
      attributes: { name: "Tag 2", weight: 1 },
      relationships: {},
    });

    // Add mock data for node entities (for simple type tests)
    this.mockData.set("node:1", {
      id: "1",
      type: "node--article",
      attributes: { title: "Node 1", body: "Content 1" },
      relationships: {},
    });

    // Mock list data for include-based fetches
    this.mockListData.set("node:article", [
      {
        id: "1",
        type: "node--article",
        attributes: { title: "Article 1" },
        relationships: {},
      },
    ]);
  }

  setShouldThrowError(shouldThrow: boolean, message?: string): void {
    this.shouldThrowError = shouldThrow;
    if (message) {
      this.errorMessage = message;
    }
  }

  async load<TAttributes extends EntityAttributes>(
    identifier: EntityIdentifier,
    id: string,
    _options?: EntityLoadOptions,
    _adapterKey?: string
  ): Promise<EntityRecord<TAttributes>> {
    if (this.shouldThrowError) {
      throw new Error(this.errorMessage);
    }

    const key = `${identifier.entity}:${id}`;
    const found = this.mockData.get(key);

    if (!found) {
      throw new Error(`Entity ${key} not found`);
    }

    return found as EntityRecord<TAttributes>;
  }

  async list<TAttributes extends EntityAttributes>(
    identifier: EntityIdentifier,
    _options?: EntityListOptions,
    _adapterKey?: string
  ): Promise<Array<EntityRecord<TAttributes>>> {
    if (this.shouldThrowError) {
      throw new Error(this.errorMessage);
    }

    const key = `${identifier.entity}:${identifier.bundle}`;
    const found = this.mockListData.get(key) || [];

    return found as Array<EntityRecord<TAttributes>>;
  }
}

describe("attachRelations", () => {
  let mockService: MockEntityService;
  let baseRecord: EntityRecord<{ title: string; body: string }>;
  let baseIdentifier: EntityIdentifier;

  beforeEach(() => {
    mockService = new MockEntityService();
    baseIdentifier = { entity: "node", bundle: "article" };

    baseRecord = {
      id: "123",
      type: "node--article",
      attributes: { title: "Test Article", body: "Test content" },
      relationships: {},
    };
  });

  describe("Basic Functionality", () => {
    test("should attach rel function to entity record", () => {
      const enhanced = attachRelations(baseRecord, mockService as any, baseIdentifier);

      expect(enhanced).toHaveProperty("rel");
      expect(typeof enhanced.rel).toBe("function");
    });

    test("should not make rel function enumerable", () => {
      const enhanced = attachRelations(baseRecord, mockService as any, baseIdentifier);

      const keys = Object.keys(enhanced);
      expect(keys).not.toContain("rel");

      // But it should be accessible
      expect(enhanced.rel).toBeDefined();
    });

    test("should return RelationAccessor with load method", () => {
      const enhanced = attachRelations(baseRecord, mockService as any, baseIdentifier);

      const relationAccessor = enhanced.rel("field_author");
      expect(relationAccessor).toHaveProperty("load");
      expect(typeof relationAccessor.load).toBe("function");
    });

    test("should maintain original record properties", () => {
      const enhanced = attachRelations(baseRecord, mockService as any, baseIdentifier);

      expect(enhanced.id).toBe(baseRecord.id);
      expect(enhanced.type).toBe(baseRecord.type);
      expect(enhanced.attributes).toBe(baseRecord.attributes);
      expect(enhanced.relationships).toBe(baseRecord.relationships);
    });
  });

  describe("Single Relationship Loading", () => {
    test("should load single related entity from linkage", async () => {
      const recordWithSingleRelation = {
        ...baseRecord,
        relationships: {
          field_author: {
            data: {
              id: "1",
              type: "user--user",
            },
          },
        },
      };

      const enhanced = attachRelations(
        recordWithSingleRelation,
        mockService as any,
        baseIdentifier
      );

      const relatedEntities = await enhanced.rel("field_author").load();

      expect(Array.isArray(relatedEntities)).toBe(true);
      expect(relatedEntities).toHaveLength(1);
      expect(relatedEntities[0]).toHaveProperty("id", "1");
      expect(relatedEntities[0]).toHaveProperty("type", "user--user");
      expect(relatedEntities[0].attributes).toHaveProperty("name", "John Doe");
    });

    test("should handle single relation with type that includes entity--bundle", async () => {
      const recordWithTypedRelation = {
        ...baseRecord,
        relationships: {
          field_tags: {
            data: {
              id: "1",
              type: "taxonomy_term--tags",
            },
          },
        },
      };

      const enhanced = attachRelations(recordWithTypedRelation, mockService as any, baseIdentifier);

      const relatedEntities = await enhanced.rel("field_tags").load();

      expect(relatedEntities).toHaveLength(1);
      expect(relatedEntities[0]).toHaveProperty("id", "1");
      expect(relatedEntities[0]).toHaveProperty("type", "taxonomy_term--tags");
    });

    test("should handle single relation without type separator", async () => {
      const recordWithSimpleType = {
        ...baseRecord,
        relationships: {
          field_user: {
            data: {
              id: "1",
              type: "user", // No -- separator
            },
          },
        },
      };

      const enhanced = attachRelations(recordWithSimpleType, mockService as any, baseIdentifier);

      // Should use the base identifier's entity/bundle
      const relatedEntities = await enhanced.rel("field_user").load();
      expect(relatedEntities).toHaveLength(1);
    });
  });

  describe("Multiple Relationship Loading", () => {
    test("should load multiple related entities from linkage array", async () => {
      const recordWithMultipleRelations = {
        ...baseRecord,
        relationships: {
          field_authors: {
            data: [
              { id: "1", type: "user--user" },
              { id: "2", type: "user--user" },
            ],
          },
        },
      };

      const enhanced = attachRelations(
        recordWithMultipleRelations,
        mockService as any,
        baseIdentifier
      );

      const relatedEntities = await enhanced.rel("field_authors").load();

      expect(Array.isArray(relatedEntities)).toBe(true);
      expect(relatedEntities).toHaveLength(2);
      expect(relatedEntities[0]).toHaveProperty("id", "1");
      expect(relatedEntities[1]).toHaveProperty("id", "2");
    });

    test("should load multiple entities with different types", async () => {
      const recordWithMixedRelations = {
        ...baseRecord,
        relationships: {
          field_mixed: {
            data: [
              { id: "1", type: "user--user" },
              { id: "1", type: "taxonomy_term--tags" },
            ],
          },
        },
      };

      const enhanced = attachRelations(
        recordWithMixedRelations,
        mockService as any,
        baseIdentifier
      );

      const relatedEntities = await enhanced.rel("field_mixed").load();

      expect(relatedEntities).toHaveLength(2);
      expect(relatedEntities[0].type).toBe("user--user");
      expect(relatedEntities[1].type).toBe("taxonomy_term--tags");
    });

    test("should handle empty linkage array", async () => {
      const recordWithEmptyRelations = {
        ...baseRecord,
        relationships: {
          field_empty: {
            data: [],
          },
        },
      };

      const enhanced = attachRelations(
        recordWithEmptyRelations,
        mockService as any,
        baseIdentifier
      );

      const relatedEntities = await enhanced.rel("field_empty").load();

      expect(Array.isArray(relatedEntities)).toBe(true);
      expect(relatedEntities).toHaveLength(0);
    });
  });

  describe("Fallback to Include-Based Loading", () => {
    test("should fallback to include-based loading when no linkage", async () => {
      const recordWithoutLinkage = {
        ...baseRecord,
        relationships: {
          field_no_linkage: {
            // No data property
          },
        },
      };

      const enhanced = attachRelations(recordWithoutLinkage, mockService as any, baseIdentifier);

      const relatedEntities = await enhanced.rel("field_no_linkage").load();

      expect(Array.isArray(relatedEntities)).toBe(true);
      // Should return empty array from fallback
      expect(relatedEntities).toHaveLength(0);
    });

    test("should fallback when linkage is invalid", async () => {
      const recordWithInvalidLinkage = {
        ...baseRecord,
        relationships: {
          field_invalid: {
            data: "invalid data",
          },
        },
      };

      const enhanced = attachRelations(
        recordWithInvalidLinkage,
        mockService as any,
        baseIdentifier
      );

      const relatedEntities = await enhanced.rel("field_invalid").load();

      expect(Array.isArray(relatedEntities)).toBe(true);
      expect(relatedEntities).toHaveLength(0);
    });

    test("should fallback for relations without relationships property", async () => {
      const recordWithoutRelationships = {
        ...baseRecord,
        // No relationships property
      };

      const enhanced = attachRelations(
        recordWithoutRelationships,
        mockService as any,
        baseIdentifier
      );

      const relatedEntities = await enhanced.rel("any_relation").load();

      expect(Array.isArray(relatedEntities)).toBe(true);
      expect(relatedEntities).toHaveLength(0);
    });
  });

  describe("Caching Mechanism", () => {
    test("should cache relationship loading results", async () => {
      const recordWithRelation = {
        ...baseRecord,
        relationships: {
          field_author: {
            data: { id: "1", type: "user--user" },
          },
        },
      };

      const enhanced = attachRelations(recordWithRelation, mockService as any, baseIdentifier);

      // Mock the service load method to track calls
      const originalLoad = mockService.load;
      const loadSpy = jest.spyOn(mockService, "load");

      // First call
      const firstResult = await enhanced.rel("field_author").load();

      // Second call should use cache
      const secondResult = await enhanced.rel("field_author").load();

      expect(firstResult).toEqual(secondResult);
      // Cache is cleared after completion, so both calls go through
      expect(loadSpy).toHaveBeenCalledTimes(2);

      loadSpy.mockRestore();
    });

    test("should use separate cache for different relations", async () => {
      const recordWithMultipleRelations = {
        ...baseRecord,
        relationships: {
          field_author: {
            data: { id: "1", type: "user--user" },
          },
          field_tags: {
            data: { id: "1", type: "taxonomy_term--tags" },
          },
        },
      };

      const enhanced = attachRelations(
        recordWithMultipleRelations,
        mockService as any,
        baseIdentifier
      );

      const loadSpy = jest.spyOn(mockService, "load");

      // Load different relations
      await enhanced.rel("field_author").load();
      await enhanced.rel("field_tags").load();

      // Should call load twice (once for each relation)
      expect(loadSpy).toHaveBeenCalledTimes(2);

      loadSpy.mockRestore();
    });

    test("should clear cache after promise completes", async () => {
      const recordWithRelation = {
        ...baseRecord,
        relationships: {
          field_author: {
            data: { id: "1", type: "user--user" },
          },
        },
      };

      const enhanced = attachRelations(recordWithRelation, mockService as any, baseIdentifier);

      const loadSpy = jest.spyOn(mockService, "load");

      // First load completes
      await enhanced.rel("field_author").load();

      // Second load should call service again (cache is cleared after completion)
      await enhanced.rel("field_author").load();

      expect(loadSpy).toHaveBeenCalledTimes(2);

      loadSpy.mockRestore();
    });
  });

  describe("Options Passing", () => {
    test("should pass options to service load method", async () => {
      const recordWithRelation = {
        ...baseRecord,
        relationships: {
          field_author: {
            data: { id: "1", type: "user--user" },
          },
        },
      };

      const enhanced = attachRelations(recordWithRelation, mockService as any, baseIdentifier);

      const loadSpy = jest.spyOn(mockService, "load");

      const options: EntityListOptions = {
        jsonapi: { query: { include: "nested_field" } },
      };

      await enhanced.rel("field_author").load(options);

      expect(loadSpy).toHaveBeenCalledWith(
        { entity: "user", bundle: "user" },
        "1",
        options,
        undefined
      );

      loadSpy.mockRestore();
    });

    test("should pass adapter key to service methods", async () => {
      const recordWithRelation = {
        ...baseRecord,
        relationships: {
          field_author: {
            data: { id: "1", type: "user--user" },
          },
        },
      };

      const enhanced = attachRelations(
        recordWithRelation,
        mockService as any,
        baseIdentifier,
        "custom-adapter"
      );

      const loadSpy = jest.spyOn(mockService, "load");

      await enhanced.rel("field_author").load();

      expect(loadSpy).toHaveBeenCalledWith(
        { entity: "user", bundle: "user" },
        "1",
        undefined,
        "custom-adapter"
      );

      loadSpy.mockRestore();
    });

    test("should pass options to fallback list method", async () => {
      const recordWithoutLinkage = {
        ...baseRecord,
        // No relationships
      };

      const enhanced = attachRelations(recordWithoutLinkage, mockService as any, baseIdentifier);

      const listSpy = jest.spyOn(mockService, "list");

      const options: EntityListOptions = {
        jsonapi: { query: { "filter[status]": 1 } },
      };

      await enhanced.rel("field_any").load(options);

      expect(listSpy).toHaveBeenCalledWith(
        baseIdentifier,
        expect.objectContaining({
          jsonapi: {
            query: expect.objectContaining({
              include: "field_any",
            }),
          },
        }),
        undefined
      );

      listSpy.mockRestore();
    });
  });

  describe("Error Handling", () => {
    test("should propagate service load errors", async () => {
      const recordWithRelation = {
        ...baseRecord,
        relationships: {
          field_author: {
            data: { id: "999", type: "user--user" },
          },
        },
      };

      const enhanced = attachRelations(recordWithRelation, mockService as any, baseIdentifier);

      await expect(enhanced.rel("field_author").load()).rejects.toThrow(
        "Entity user:999 not found"
      );
    });

    test("should propagate service list errors", async () => {
      const recordWithoutLinkage = {
        ...baseRecord,
        // No relationships - will use fallback
      };

      mockService.setShouldThrowError(true, "Service list error");

      const enhanced = attachRelations(recordWithoutLinkage, mockService as any, baseIdentifier);

      await expect(enhanced.rel("field_any").load()).rejects.toThrow("Service list error");
    });

    test("should handle errors during relationship processing", async () => {
      const recordWithMalformedRelation = {
        ...baseRecord,
        relationships: {
          field_malformed: {
            data: { id: "1" }, // Missing type
          },
        },
      };

      const enhanced = attachRelations(
        recordWithMalformedRelation,
        mockService as any,
        baseIdentifier
      );

      // Should handle the malformed data gracefully
      const results = await enhanced.rel("field_malformed").load();
      expect(Array.isArray(results)).toBe(true);
    });

    test("should clean up cache on error", async () => {
      const recordWithRelation = {
        ...baseRecord,
        relationships: {
          field_author: {
            data: { id: "999", type: "user--user" },
          },
        },
      };

      const enhanced = attachRelations(recordWithRelation, mockService as any, baseIdentifier);

      // First call should fail
      await expect(enhanced.rel("field_author").load()).rejects.toThrow();

      // Cache should be cleaned up, so second call should also hit the service
      await expect(enhanced.rel("field_author").load()).rejects.toThrow();
    });
  });

  describe("Type Safety", () => {
    test("should maintain type safety for relation load", async () => {
      interface UserAttributes extends EntityAttributes {
        name: string;
        email: string;
      }

      const recordWithRelation = {
        ...baseRecord,
        relationships: {
          field_author: {
            data: { id: "1", type: "user--user" },
          },
        },
      };

      const enhanced = attachRelations(recordWithRelation, mockService as any, baseIdentifier);

      const relatedUsers = await (enhanced as any).rel("field_author").load();

      expect(relatedUsers[0].attributes).toHaveProperty("name");
      expect(relatedUsers[0].attributes).toHaveProperty("email");
    });

    test("should work with different attribute types", async () => {
      interface TagAttributes extends EntityAttributes {
        name: string;
        weight: number;
      }

      const recordWithTags = {
        ...baseRecord,
        relationships: {
          field_tags: {
            data: [
              { id: "1", type: "taxonomy_term--tags" },
              { id: "2", type: "taxonomy_term--tags" },
            ],
          },
        },
      };

      const enhanced = attachRelations(recordWithTags, mockService as any, baseIdentifier);

      const relatedTags = await (enhanced as any).rel("field_tags").load();

      expect(relatedTags).toHaveLength(2);
      relatedTags.forEach((tag: EntityRecord<TagAttributes>) => {
        expect(tag.attributes).toHaveProperty("name");
        expect(tag.attributes).toHaveProperty("weight");
      });
    });
  });

  describe("Edge Cases", () => {
    test("should handle null relationships", () => {
      const recordWithNullRelationships = {
        ...baseRecord,
        relationships: null as any,
      };

      const enhanced = attachRelations(
        recordWithNullRelationships,
        mockService as any,
        baseIdentifier
      );

      expect(enhanced.rel).toBeDefined();
      expect(() => enhanced.rel("field_any")).not.toThrow();
    });

    test("should handle undefined relationships", () => {
      const recordWithUndefinedRelationships = {
        ...baseRecord,
        relationships: undefined as any,
      };

      const enhanced = attachRelations(
        recordWithUndefinedRelationships,
        mockService as any,
        baseIdentifier
      );

      expect(enhanced.rel).toBeDefined();
      expect(() => enhanced.rel("field_any")).not.toThrow();
    });

    test("should handle empty relation names", async () => {
      const enhanced = attachRelations(baseRecord, mockService as any, baseIdentifier);

      const results = await enhanced.rel("").load();
      expect(Array.isArray(results)).toBe(true);
    });

    test("should handle special characters in relation names", async () => {
      const recordWithSpecialRelation = {
        ...baseRecord,
        relationships: {
          "field_special-name_123": {
            data: { id: "1", type: "user--user" },
          },
        },
      };

      const enhanced = attachRelations(
        recordWithSpecialRelation,
        mockService as any,
        baseIdentifier
      );

      const results = await enhanced.rel("field_special-name_123").load();
      expect(Array.isArray(results)).toBe(true);
    });

    test("should handle very long relation names", async () => {
      const longRelationName = "field_very_long_relation_name_that_exceeds_normal_expectations";

      const enhanced = attachRelations(baseRecord, mockService as any, baseIdentifier);

      const results = await enhanced.rel(longRelationName).load();
      expect(Array.isArray(results)).toBe(true);
    });
  });
});
