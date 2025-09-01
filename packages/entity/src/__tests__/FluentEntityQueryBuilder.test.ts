/**
 * Tests for FluentEntity query building functionality.
 * Validates sort operations, pagination, parameter handling, and service method calls.
 */

import { FluentEntity } from "../FluentEntity";

// Create a simple test to verify the internal query building 
describe("FluentEntity Query Building", () => {

  // Tests verify query building functionality through FluentEntity's public API
  
  test("should handle ASC sort direction correctly", () => {
    // Create FluentEntity instance with mock service
    const MockService = require('../EntityService').EntityService;
    const mockService = {
      load: jest.fn().mockResolvedValue({ id: "1", type: "test", attributes: {} }),
      list: jest.fn().mockResolvedValue([]),
      listPage: jest.fn().mockResolvedValue({ items: [], page: {} }),
      count: jest.fn().mockResolvedValue(42)
    };
    
    const fluentEntity = new FluentEntity(mockService as any, { entity: "node", bundle: "article" });
    
    // Verify ASC sort does not add negative prefix to field name
    fluentEntity.sort("title", "ASC");
    const query = (fluentEntity as any).qb.toObject();
    expect(query.sort).toBe("title");
  });

  test("should handle page number parameter in pagination", () => {
    const mockService = {
      load: jest.fn().mockResolvedValue({ id: "1", type: "test", attributes: {} }),
      list: jest.fn().mockResolvedValue([]),
    };
    
    const fluentEntity = new FluentEntity(mockService as any, { entity: "node", bundle: "article" });
    
    // Test pagination with page number parameter
    fluentEntity.page({ number: 5 });
    const query = (fluentEntity as any).qb.toObject();
    expect(query["page[number]"]).toBe(5);
  });

  test("should handle fromParams with invalid query object function", () => {
    const mockService = {
      load: jest.fn().mockResolvedValue({ id: "1", type: "test", attributes: {} }),
    };
    
    const fluentEntity = new FluentEntity(mockService as any, { entity: "node", bundle: "article" });
    
    // Test fromParams with invalid query object function
    const result = fluentEntity.fromParams({ getQueryObject: "not-a-function" } as any);
    expect(result).toBe(fluentEntity);
  });

  test("should handle listPage operation without options", async () => {
    const mockService = {
      listPage: jest.fn().mockResolvedValue({ items: [{ id: "1", type: "test", attributes: {} }], page: {} }),
    };
    
    const fluentEntity = new FluentEntity(mockService as any, { entity: "node", bundle: "article" });
    
    // Test listPage method without providing options
    const result = await fluentEntity.listPage();
    expect(result.items).toBeDefined();
    expect(mockService.listPage).toHaveBeenCalledWith(
      { entity: "node", bundle: "article" },
      { jsonapi: { query: {} } }
    );
  });

  test("should handle get operation without options", async () => {
    const mockService = {
      load: jest.fn().mockResolvedValue({ id: "test-id", type: "test", attributes: {} }),
    };
    
    const fluentEntity = new FluentEntity(mockService as any, { entity: "node", bundle: "article" });
    
    // Test get method without providing options
    const result = await fluentEntity.id("test-id").get();
    expect(result.id).toBe("test-id");
    expect(mockService.load).toHaveBeenCalledWith(
      { entity: "node", bundle: "article" },
      "test-id",
      { jsonapi: { query: {} } }
    );
  });

  test("should handle count operation without options", async () => {
    const mockService = {
      list: jest.fn().mockResolvedValue([{ id: "1" }, { id: "2" }]),
    };
    
    const fluentEntity = new FluentEntity(mockService as any, { entity: "node", bundle: "article" });
    
    // Test count method without providing options
    const count = await fluentEntity.count();
    expect(count).toBe(2);
    expect(mockService.list).toHaveBeenCalledWith(
      { entity: "node", bundle: "article" },
      { jsonapi: { query: {} } }
    );
  });

});
