import { attachRelations } from "../relations";

/**
 * Final test to achieve 100% coverage for relations.ts
 * Specifically targeting line 51: typeStr.includes("--") ? typeStr.split("--") : [identifier.entity, identifier.bundle]
 */

describe("Relations Final Coverage - Line 51", () => {
  
  test("Line 51: typeStr without double-dash (fallback branch)", async () => {
    const mockService = {
      load: jest.fn().mockResolvedValue({ 
        id: "fallback-test", 
        type: "test", 
        attributes: { name: "Fallback Entity" } 
      }),
      list: jest.fn().mockResolvedValue([])
    };

    // Create a record with a single relationship that has a type WITHOUT double-dash
    const record = {
      id: "parent-record",
      type: "node--article",
      attributes: { title: "Parent Article" },
      relationships: {
        field_simple_ref: {
          data: { 
            type: "user", // NO double-dash - should trigger fallback to identifier
            id: "user-123"
          }
        }
      }
    };

    const identifier = { entity: "backup_entity", bundle: "backup_bundle" };
    
    const recordWithRel = attachRelations(
      record,
      mockService as any,
      identifier
    );

    // Load the relation - this should hit line 51 fallback branch
    const relations = await recordWithRel.rel("field_simple_ref").load();
    
    // Verify that the identifier entity/bundle was used (fallback branch)
    expect(mockService.load).toHaveBeenCalledWith(
      { entity: "backup_entity", bundle: "backup_bundle" }, // From identifier fallback
      "user-123",
      undefined,
      undefined
    );
    
    expect(relations).toHaveLength(1);
    expect(relations[0].id).toBe("fallback-test");
  });

  test("Line 51: empty string typeStr (fallback branch)", async () => {
    const mockService = {
      load: jest.fn().mockResolvedValue({ 
        id: "empty-test", 
        type: "test", 
        attributes: { name: "Empty Type Entity" } 
      }),
      list: jest.fn().mockResolvedValue([])
    };

    const record = {
      id: "parent-record",
      type: "node--article", 
      attributes: { title: "Parent Article" },
      relationships: {
        field_empty_ref: {
          data: { 
            type: "", // Empty string - should not contain "--", use fallback
            id: "empty-id"
          }
        }
      }
    };

    const identifier = { entity: "fallback_entity", bundle: "fallback_bundle" };
    
    const recordWithRel = attachRelations(
      record,
      mockService as any,
      identifier
    );

    const relations = await recordWithRel.rel("field_empty_ref").load();
    
    // Should use identifier fallback since empty string doesn't contain "--"
    expect(mockService.load).toHaveBeenCalledWith(
      { entity: "fallback_entity", bundle: "fallback_bundle" },
      "empty-id",
      undefined,
      undefined
    );
    
    expect(relations).toHaveLength(1);
    expect(relations[0].id).toBe("empty-test");
  });

  test("Line 51: single word typeStr (fallback branch)", async () => {
    const mockService = {
      load: jest.fn().mockResolvedValue({ 
        id: "single-word-test", 
        type: "test", 
        attributes: { name: "Single Word Entity" } 
      }),
      list: jest.fn().mockResolvedValue([])
    };

    const record = {
      id: "parent-record",
      type: "node--article",
      attributes: { title: "Parent Article" },
      relationships: {
        field_word_ref: {
          data: { 
            type: "taxonomy", // Single word, no "--", should use fallback
            id: "term-456"
          }
        }
      }
    };

    const identifier = { entity: "default_entity", bundle: "default_bundle" };
    
    const recordWithRel = attachRelations(
      record,
      mockService as any,
      identifier
    );

    const relations = await recordWithRel.rel("field_word_ref").load();
    
    // Should use identifier fallback since "taxonomy" doesn't contain "--"
    expect(mockService.load).toHaveBeenCalledWith(
      { entity: "default_entity", bundle: "default_bundle" },
      "term-456",
      undefined,
      undefined
    );
    
    expect(relations).toHaveLength(1);
    expect(relations[0].id).toBe("single-word-test");
  });

  test("Line 51: comparison - typeStr WITH double-dash (split branch)", async () => {
    const mockService = {
      load: jest.fn().mockResolvedValue({ 
        id: "split-test", 
        type: "test", 
        attributes: { name: "Split Entity" } 
      }),
      list: jest.fn().mockResolvedValue([])
    };

    const record = {
      id: "parent-record",
      type: "node--article",
      attributes: { title: "Parent Article" },
      relationships: {
        field_split_ref: {
          data: { 
            type: "taxonomy_term--tags", // HAS double-dash - should split
            id: "term-789"
          }
        }
      }
    };

    const identifier = { entity: "should_not_be_used", bundle: "should_not_be_used" };
    
    const recordWithRel = attachRelations(
      record,
      mockService as any,
      identifier
    );

    const relations = await recordWithRel.rel("field_split_ref").load();
    
    // Should use split values, NOT identifier fallback
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
