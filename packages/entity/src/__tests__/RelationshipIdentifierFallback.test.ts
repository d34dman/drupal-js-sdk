import { attachRelations } from "../relations";

/**
 * Test to cover line 51 in relations.ts
 * Line 51: const [entity, bundle] = typeStr.includes("--") ? typeStr.split("--") : [identifier.entity, identifier.bundle];
 */

describe("Relations Line 51 Coverage", () => {
  test("Line 51: typeStr without double dash should use identifier fallback", async () => {
    const mockService = {
      load: jest.fn().mockResolvedValue({ id: "test", type: "test", attributes: {} }),
      list: jest.fn().mockResolvedValue([])
    };

    const record = {
      id: "test-record",
      type: "node--article",
      attributes: { title: "Test" },
      relationships: {
        field_single: {
          data: { 
            type: "simple_type", // No double dash - should trigger identifier fallback
            id: "single-id"
          }
        }
      }
    };

    const recordWithRel = attachRelations(
      record,
      mockService as any,
      { entity: "fallback_entity", bundle: "fallback_bundle" }
    );

    const relations = await recordWithRel.rel("field_single").load();
    
    // Should call load with fallback entity/bundle from identifier
    expect(mockService.load).toHaveBeenCalledWith(
      { entity: "fallback_entity", bundle: "fallback_bundle" },
      "single-id",
      undefined,
      undefined
    );
    
    expect(relations).toHaveLength(1);
    expect(relations[0].id).toBe("test");
  });

  test("should use identifier fallback when type string is empty", async () => {
    const mockService = {
      load: jest.fn().mockResolvedValue({ id: "empty", type: "test", attributes: {} }),
      list: jest.fn().mockResolvedValue([])
    };

    const record = {
      id: "test-record",
      type: "node--article", 
      attributes: { title: "Test" },
      relationships: {
        field_empty_type: {
          data: { 
            type: "", // Empty string - should use identifier fallback
            id: "empty-type-id"
          }
        }
      }
    };

    const recordWithRel = attachRelations(
      record,
      mockService as any,
      { entity: "default_entity", bundle: "default_bundle" }
    );

    const relations = await recordWithRel.rel("field_empty_type").load();
    
    // Should use identifier entity/bundle since typeStr is empty
    expect(mockService.load).toHaveBeenCalledWith(
      { entity: "default_entity", bundle: "default_bundle" },
      "empty-type-id",
      undefined,
      undefined
    );
    
    expect(relations).toHaveLength(1);
  });
});
