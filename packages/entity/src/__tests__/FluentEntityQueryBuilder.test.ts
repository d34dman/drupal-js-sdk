/**
 * Tests to achieve 100% coverage for FluentEntity.ts
 * Targeting lines: 38, 44, 80, 111, 126, 143
 */

import { FluentEntity } from "../FluentEntity";

// Create a simple test to verify the internal query building 
describe("FluentEntity 100% Coverage Tests", () => {

  // These tests target the internal JsonApiQueryBuilder class methods
  // which are accessed through FluentEntity's public API
  
  test("Line 38: ASC sort direction handling", () => {
    // Create a new instance using the internal constructor approach
    const MockService = require('../EntityService').EntityService;
    const mockService = {
      load: jest.fn().mockResolvedValue({ id: "1", type: "test", attributes: {} }),
      list: jest.fn().mockResolvedValue([]),
      listPage: jest.fn().mockResolvedValue({ items: [], page: {} }),
      count: jest.fn().mockResolvedValue(42)
    };
    
    const fluentEntity = new FluentEntity(mockService as any, { entity: "node", bundle: "article" });
    
    // Test ASC sort (should not add '-' prefix)
    fluentEntity.sort("title", "ASC");
    const query = (fluentEntity as any).qb.toObject();
    expect(query.sort).toBe("title");
  });

  test("Line 44: page number parameter", () => {
    const mockService = {
      load: jest.fn().mockResolvedValue({ id: "1", type: "test", attributes: {} }),
      list: jest.fn().mockResolvedValue([]),
    };
    
    const fluentEntity = new FluentEntity(mockService as any, { entity: "node", bundle: "article" });
    
    // Test page number to hit line 44
    fluentEntity.page({ number: 5 });
    const query = (fluentEntity as any).qb.toObject();
    expect(query["page[number]"]).toBe(5);
  });

  test("Line 80: fromParams with invalid getQueryObject", () => {
    const mockService = {
      load: jest.fn().mockResolvedValue({ id: "1", type: "test", attributes: {} }),
    };
    
    const fluentEntity = new FluentEntity(mockService as any, { entity: "node", bundle: "article" });
    
    // Test with non-function getQueryObject
    const result = fluentEntity.fromParams({ getQueryObject: "not-a-function" } as any);
    expect(result).toBe(fluentEntity);
  });

  test("Line 111: listPage without options", async () => {
    const mockService = {
      listPage: jest.fn().mockResolvedValue({ items: [{ id: "1", type: "test", attributes: {} }], page: {} }),
    };
    
    const fluentEntity = new FluentEntity(mockService as any, { entity: "node", bundle: "article" });
    
    // Call listPage without options parameter
    const result = await fluentEntity.listPage();
    expect(result.items).toBeDefined();
    expect(mockService.listPage).toHaveBeenCalledWith(
      { entity: "node", bundle: "article" },
      { jsonapi: { query: {} } }
    );
  });

  test("Line 126: get without options", async () => {
    const mockService = {
      load: jest.fn().mockResolvedValue({ id: "test-id", type: "test", attributes: {} }),
    };
    
    const fluentEntity = new FluentEntity(mockService as any, { entity: "node", bundle: "article" });
    
    // Call get without options parameter
    const result = await fluentEntity.id("test-id").get();
    expect(result.id).toBe("test-id");
    expect(mockService.load).toHaveBeenCalledWith(
      { entity: "node", bundle: "article" },
      "test-id",
      { jsonapi: { query: {} } }
    );
  });

  test("Line 143: count without options", async () => {
    const mockService = {
      list: jest.fn().mockResolvedValue([{ id: "1" }, { id: "2" }]),
    };
    
    const fluentEntity = new FluentEntity(mockService as any, { entity: "node", bundle: "article" });
    
    // Call count without options parameter
    const count = await fluentEntity.count();
    expect(count).toBe(2);
    expect(mockService.list).toHaveBeenCalledWith(
      { entity: "node", bundle: "article" },
      { jsonapi: { query: {} } }
    );
  });

});
