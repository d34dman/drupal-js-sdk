import { attachRelations } from "../relations";

/**
 * Tests for relationship type string parsing logic.
 * Validates how entity types are parsed and when identifier fallbacks are used.
 */

describe("Relationship Type String Parsing", () => {
  test("should use identifier fallback when type string has no double-dash", async () => {
    const mockService = {
      load: jest.fn().mockResolvedValue({
        id: "fallback-test",
        type: "test",
        attributes: { name: "Fallback Entity" },
      }),
      list: jest.fn().mockResolvedValue([]),
    };

    // Create a record with a single relationship that has a type WITHOUT double-dash
    const record = {
      id: "parent-record",
      type: "node--article",
      attributes: { title: "Parent Article" },
      relationships: {
        field_simple_ref: {
          data: {
            type: "user", // Simple type without separator - should use identifier fallback
            id: "user-123",
          },
        },
      },
    };

    const identifier = { entity: "backup_entity", bundle: "backup_bundle" };

    const recordWithRel = attachRelations(record, mockService as any, identifier);

    // Load the relation - this should hit line 51 fallback branch
    const relations = await recordWithRel.rel("field_simple_ref").load();

    // Verify identifier fallback was used when type lacks separator
    expect(mockService.load).toHaveBeenCalledWith(
      { entity: "backup_entity", bundle: "backup_bundle" }, // From identifier fallback
      "user-123",
      undefined,
      undefined
    );

    expect(relations).toHaveLength(1);
    expect(relations[0].id).toBe("fallback-test");
  });

  test("should use identifier fallback when type string is empty", async () => {
    const mockService = {
      load: jest.fn().mockResolvedValue({
        id: "empty-test",
        type: "test",
        attributes: { name: "Empty Type Entity" },
      }),
      list: jest.fn().mockResolvedValue([]),
    };

    const record = {
      id: "parent-record",
      type: "node--article",
      attributes: { title: "Parent Article" },
      relationships: {
        field_empty_ref: {
          data: {
            type: "", // Empty type string should use identifier fallback
            id: "empty-id",
          },
        },
      },
    };

    const identifier = { entity: "fallback_entity", bundle: "fallback_bundle" };

    const recordWithRel = attachRelations(record, mockService as any, identifier);

    const relations = await recordWithRel.rel("field_empty_ref").load();

    // Verify empty type string triggers identifier fallback
    expect(mockService.load).toHaveBeenCalledWith(
      { entity: "fallback_entity", bundle: "fallback_bundle" },
      "empty-id",
      undefined,
      undefined
    );

    expect(relations).toHaveLength(1);
    expect(relations[0].id).toBe("empty-test");
  });

  test("should use identifier fallback for single word type strings", async () => {
    const mockService = {
      load: jest.fn().mockResolvedValue({
        id: "single-word-test",
        type: "test",
        attributes: { name: "Single Word Entity" },
      }),
      list: jest.fn().mockResolvedValue([]),
    };

    const record = {
      id: "parent-record",
      type: "node--article",
      attributes: { title: "Parent Article" },
      relationships: {
        field_word_ref: {
          data: {
            type: "taxonomy", // Single word type should use identifier fallback
            id: "term-456",
          },
        },
      },
    };

    const identifier = { entity: "default_entity", bundle: "default_bundle" };

    const recordWithRel = attachRelations(record, mockService as any, identifier);

    const relations = await recordWithRel.rel("field_word_ref").load();

    // Verify single word type triggers identifier fallback
    expect(mockService.load).toHaveBeenCalledWith(
      { entity: "default_entity", bundle: "default_bundle" },
      "term-456",
      undefined,
      undefined
    );

    expect(relations).toHaveLength(1);
    expect(relations[0].id).toBe("single-word-test");
  });

  test("should parse entity and bundle when type string contains double-dash", async () => {
    const mockService = {
      load: jest.fn().mockResolvedValue({
        id: "split-test",
        type: "test",
        attributes: { name: "Split Entity" },
      }),
      list: jest.fn().mockResolvedValue([]),
    };

    const record = {
      id: "parent-record",
      type: "node--article",
      attributes: { title: "Parent Article" },
      relationships: {
        field_split_ref: {
          data: {
            type: "taxonomy_term--tags", // Proper entity--bundle format for parsing
            id: "term-789",
          },
        },
      },
    };

    const identifier = { entity: "should_not_be_used", bundle: "should_not_be_used" };

    const recordWithRel = attachRelations(record, mockService as any, identifier);

    const relations = await recordWithRel.rel("field_split_ref").load();

    // Verify type string is properly parsed into entity and bundle
    expect(mockService.load).toHaveBeenCalledWith(
      { entity: "taxonomy_term", bundle: "tags" }, // From typeStr.split("--")
      "term-789",
      undefined,
      undefined
    );

    expect(relations).toHaveLength(1);
    expect(relations[0].id).toBe("split-test");
  });
});
