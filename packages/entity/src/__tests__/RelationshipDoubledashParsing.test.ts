import { attachRelations } from "../relations";

/**
 * Direct test to hit line 51 in relations.ts
 * Line 51: const [entity, bundle] = typeStr.includes("--") ? typeStr.split("--") : [identifier.entity, identifier.bundle];
 *
 * This test specifically targets the RIGHT side of the ternary operator (the fallback branch)
 */

describe("Relationship Double-Dash Type Parsing", () => {
  test("should use entity identifier fallback when type has no double-dash separator", async () => {
    const mockService = {
      load: jest.fn().mockImplementation((id, entityId) => {
        return Promise.resolve({
          id: entityId,
          type: `${id.entity}--${id.bundle}`,
          attributes: { name: `Mock entity ${entityId}` },
        });
      }),
      list: jest.fn().mockResolvedValue([]),
    };

    // Create a record with single relationship data that explicitly has NO double-dash
    const testRecord = {
      id: "test-parent",
      type: "node--article",
      attributes: { title: "Test Parent" },
      relationships: {
        simple_ref: {
          data: {
            type: "user", // NO double-dash! This is key - should trigger fallback
            id: "user-123",
          },
        },
      },
    };

    // Use a clear identifier for fallback
    const fallbackIdentifier = { entity: "fallback_type", bundle: "fallback_bundle" };

    const recordWithRel = attachRelations(testRecord, mockService as any, fallbackIdentifier);

    // This should hit the else if branch (single linked entity)
    // and then line 51 fallback: [identifier.entity, identifier.bundle]
    const relations = await recordWithRel.rel("simple_ref").load();

    // Verify that fallback entity/bundle from identifier was used
    expect(mockService.load).toHaveBeenCalledWith(
      { entity: "fallback_type", bundle: "fallback_bundle" }, // From identifier fallback
      "user-123",
      undefined,
      undefined
    );

    expect(relations).toHaveLength(1);
    expect(relations[0].id).toBe("user-123");
  });

  test("should properly split entity and bundle when type contains double-dash", async () => {
    const mockService = {
      load: jest.fn().mockImplementation((id, entityId) => {
        return Promise.resolve({
          id: entityId,
          type: `${id.entity}--${id.bundle}`,
          attributes: { name: `Mock entity ${entityId}` },
        });
      }),
      list: jest.fn().mockResolvedValue([]),
    };

    const testRecord = {
      id: "test-parent",
      type: "node--article",
      attributes: { title: "Test Parent" },
      relationships: {
        split_ref: {
          data: {
            type: "taxonomy_term--categories", // HAS double-dash - should split
            id: "term-456",
          },
        },
      },
    };

    const fallbackIdentifier = { entity: "should_not_be_used", bundle: "should_not_be_used" };

    const recordWithRel = attachRelations(testRecord, mockService as any, fallbackIdentifier);

    const relations = await recordWithRel.rel("split_ref").load();

    // Should use split values, NOT fallback
    expect(mockService.load).toHaveBeenCalledWith(
      { entity: "taxonomy_term", bundle: "categories" }, // From typeStr.split("--")
      "term-456",
      undefined,
      undefined
    );

    expect(relations).toHaveLength(1);
  });

  test("should handle empty type string by using identifier fallback", async () => {
    const mockService = {
      load: jest.fn().mockResolvedValue({
        id: "empty-type-result",
        type: "test",
        attributes: {},
      }),
      list: jest.fn().mockResolvedValue([]),
    };

    const testRecord = {
      id: "test-parent",
      type: "node--article",
      attributes: { title: "Test Parent" },
      relationships: {
        empty_ref: {
          data: {
            type: "", // Empty string - definitely no "--", should use fallback
            id: "empty-123",
          },
        },
      },
    };

    const fallbackIdentifier = { entity: "empty_fallback", bundle: "empty_bundle" };

    const recordWithRel = attachRelations(testRecord, mockService as any, fallbackIdentifier);

    const relations = await recordWithRel.rel("empty_ref").load();

    expect(mockService.load).toHaveBeenCalledWith(
      { entity: "empty_fallback", bundle: "empty_bundle" },
      "empty-123",
      undefined,
      undefined
    );

    expect(relations).toHaveLength(1);
  });

  test("should handle type strings with special characters but no double-dash", async () => {
    const mockService = {
      load: jest.fn().mockResolvedValue({
        id: "special-chars-result",
        type: "test",
        attributes: {},
      }),
      list: jest.fn().mockResolvedValue([]),
    };

    const testRecord = {
      id: "test-parent",
      type: "node--article",
      attributes: { title: "Test Parent" },
      relationships: {
        special_ref: {
          data: {
            type: "type_with_underscores", // Has underscores but no "--"
            id: "special-789",
          },
        },
      },
    };

    const fallbackIdentifier = { entity: "special_fallback", bundle: "special_bundle" };

    const recordWithRel = attachRelations(testRecord, mockService as any, fallbackIdentifier);

    const relations = await recordWithRel.rel("special_ref").load();

    expect(mockService.load).toHaveBeenCalledWith(
      { entity: "special_fallback", bundle: "special_bundle" },
      "special-789",
      undefined,
      undefined
    );

    expect(relations).toHaveLength(1);
  });
});
