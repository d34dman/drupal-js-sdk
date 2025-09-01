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
 * Tests for relationship loading and caching functionality.
 * Validates entity relationship loading, promise caching, and type parsing.
 */

class MockEntityService {
  private readonly mockData: Map<string, EntityRecord<EntityAttributes>> = new Map();
  private shouldThrowError = false;

  constructor() {
    this.setupMockData();
  }

  private setupMockData(): void {
    // Mock related entities
    this.mockData.set("user:1", {
      id: "1",
      type: "user--user",
      attributes: { name: "John Doe" },
      relationships: {},
    });

    this.mockData.set("user:2", {
      id: "2",
      type: "user--user",
      attributes: { name: "Jane Smith" },
      relationships: {},
    });

    this.mockData.set("taxonomy_term:1", {
      id: "1",
      type: "taxonomy_term--tags",
      attributes: { name: "Tag 1" },
      relationships: {},
    });
  }

  async load<TAttributes extends EntityAttributes>(
    identifier: EntityIdentifier,
    id: string,
    options?: EntityLoadOptions,
    adapterKey?: string
  ): Promise<EntityRecord<TAttributes>> {
    if (this.shouldThrowError) {
      throw new Error("Mock load error");
    }

    const key = `${identifier.entity}:${id}`;
    const mockRecord = this.mockData.get(key);

    if (mockRecord) {
      return mockRecord as EntityRecord<TAttributes>;
    }

    // Return a generic mock record
    return {
      id,
      type: `${identifier.entity}--${identifier.bundle || identifier.entity}`,
      attributes: { title: `Mock ${identifier.entity} ${id}` } as unknown as TAttributes,
      relationships: {},
    };
  }

  async list<TAttributes extends EntityAttributes>(
    identifier: EntityIdentifier,
    options?: EntityListOptions,
    adapterKey?: string
  ): Promise<Array<EntityRecord<TAttributes>>> {
    if (this.shouldThrowError) {
      throw new Error("Mock list error");
    }

    return [];
  }

  setThrowError(shouldThrow: boolean): void {
    this.shouldThrowError = shouldThrow;
  }
}

describe("Relationship Loading and Caching", () => {
  let mockService: MockEntityService;
  const identifier: EntityIdentifier = { entity: "node", bundle: "article" };

  beforeEach(() => {
    mockService = new MockEntityService();
  });

  afterEach(() => {
    // Clear the relation cache between tests
    const relationModule = require("../relations");
    if (relationModule.relationPromiseCache) {
      relationModule.relationPromiseCache.clear();
    }
  });

  describe("Promise Caching Mechanism", () => {
    test("should use cached promise when loading the same relationship multiple times", async () => {
      // Create a record with relationship data for caching test
      const recordWithRelation: EntityRecord<{ title: string }> = {
        id: "test-1",
        type: "node--article",
        attributes: { title: "Test Article" },
        relationships: {
          field_author: {
            data: { type: "user--user", id: "1" },
          },
        },
      };

      const recordWithRel = attachRelations(recordWithRelation, mockService as any, identifier);

      // First call should create and cache the promise
      const firstLoad = recordWithRel.rel("field_author").load();

      // Second call should reuse the cached promise
      const secondLoad = recordWithRel.rel("field_author").load();

      // Verify both calls return the same cached results

      const result1 = await firstLoad;
      const result2 = await secondLoad;

      expect(result1).toEqual(result2);
      expect(result1[0].id).toBe("1");
    });

    test("should handle multiple linked entities with proper type parsing", async () => {
      // Test processing of multiple linked entities in a single relationship
      const recordWithMultipleRelations: EntityRecord<{ title: string }> = {
        id: "test-2",
        type: "node--article",
        attributes: { title: "Article with Multiple Tags" },
        relationships: {
          field_tags: {
            data: [
              { type: "taxonomy_term--tags", id: "1" },
              { type: "taxonomy_term--tags", id: "2" },
              { type: "user--user", id: "1" }, // Mixed entity types to test parsing
            ],
          },
        },
      };

      const recordWithRel = attachRelations(
        recordWithMultipleRelations,
        mockService as any,
        identifier
      );

      const relations = await recordWithRel.rel("field_tags").load();

      expect(relations).toHaveLength(3);
      expect(relations[0].id).toBe("1");
      expect(relations[0].type).toBe("taxonomy_term--tags");
      expect(relations[1].id).toBe("2");
      expect(relations[1].type).toBe("taxonomy_term--tags");
      expect(relations[2].id).toBe("1");
      expect(relations[2].type).toBe("user--user");
    });

    test("should handle single linked entity relationships", async () => {
      // Test processing of single linked entity relationship
      const recordWithSingleRelation: EntityRecord<{ title: string }> = {
        id: "test-3",
        type: "node--article",
        attributes: { title: "Article with Single Author" },
        relationships: {
          field_author: {
            data: { type: "user--user", id: "1" },
          },
        },
      };

      const recordWithRel = attachRelations(
        recordWithSingleRelation,
        mockService as any,
        identifier
      );

      const relations = await recordWithRel.rel("field_author").load();

      expect(relations).toHaveLength(1);
      expect(relations[0].id).toBe("1");
      expect(relations[0].type).toBe("user--user");
    });
  });

  describe("Relationship Data Edge Cases", () => {
    test("should handle entity type with double dashes", async () => {
      const recordWithComplexType: EntityRecord<{ title: string }> = {
        id: "test-4",
        type: "node--article",
        attributes: { title: "Complex Type Test" },
        relationships: {
          field_reference: {
            data: { type: "paragraph--text_with_summary", id: "1" },
          },
        },
      };

      const recordWithRel = attachRelations(recordWithComplexType, mockService as any, identifier);

      const relations = await recordWithRel.rel("field_reference").load();

      expect(relations[0].id).toBe("1");
      expect(relations[0].type).toBe("paragraph--text_with_summary");
    });

    test("should handle linkage without type (fallback to identifier)", async () => {
      const recordWithNoType: EntityRecord<{ title: string }> = {
        id: "test-5",
        type: "node--article",
        attributes: { title: "No Type Test" },
        relationships: {
          field_ref: {
            data: { id: "1" }, // No type property
          },
        },
      };

      const recordWithRel = attachRelations(recordWithNoType, mockService as any, identifier);

      const relations = await recordWithRel.rel("field_ref").load();

      expect(relations[0].id).toBe("1");
    });

    test("should handle empty linkage array", async () => {
      const recordWithEmptyArray: EntityRecord<{ title: string }> = {
        id: "test-6",
        type: "node--article",
        attributes: { title: "Empty Array Test" },
        relationships: {
          field_empty: {
            data: [], // Empty array
          },
        },
      };

      const recordWithRel = attachRelations(recordWithEmptyArray, mockService as any, identifier);

      const relations = await recordWithRel.rel("field_empty").load();

      expect(relations).toHaveLength(0);
    });

    test("should handle no relationships object", async () => {
      const recordWithoutRelationships: EntityRecord<{ title: string }> = {
        id: "test-7",
        type: "node--article",
        attributes: { title: "No Relationships Test" },
        // No relationships property
      };

      const recordWithRel = attachRelations(
        recordWithoutRelationships,
        mockService as any,
        identifier
      );

      const relations = await recordWithRel.rel("field_nonexistent").load();

      expect(relations).toHaveLength(0);
    });

    test("should handle null relationships", async () => {
      const recordWithNullRelationships: EntityRecord<{ title: string }> = {
        id: "test-8",
        type: "node--article",
        attributes: { title: "Null Relationships Test" },
        relationships: undefined,
      };

      const recordWithRel = attachRelations(
        recordWithNullRelationships,
        mockService as any,
        identifier
      );

      const relations = await recordWithRel.rel("field_null").load();

      expect(relations).toHaveLength(0);
    });

    test("should handle string relationships", async () => {
      const recordWithStringRelationships: EntityRecord<{ title: string }> = {
        id: "test-9",
        type: "node--article",
        attributes: { title: "String Relationships Test" },
        relationships: "not an object" as any,
      };

      const recordWithRel = attachRelations(
        recordWithStringRelationships,
        mockService as any,
        identifier
      );

      const relations = await recordWithRel.rel("field_string").load();

      expect(relations).toHaveLength(0);
    });

    test("should handle linkage with null/undefined type and id", async () => {
      const recordWithNullLinkage: EntityRecord<{ title: string }> = {
        id: "test-10",
        type: "node--article",
        attributes: { title: "Null Linkage Test" },
        relationships: {
          field_null_linkage: {
            data: [
              { type: null, id: null },
              { type: undefined, id: undefined },
              { id: "valid-id" },
            ],
          },
        },
      };

      const recordWithRel = attachRelations(recordWithNullLinkage, mockService as any, identifier);

      const relations = await recordWithRel.rel("field_null_linkage").load();

      // Should still process all entries, converting null/undefined to strings
      expect(relations).toHaveLength(3);
    });
  });
});
