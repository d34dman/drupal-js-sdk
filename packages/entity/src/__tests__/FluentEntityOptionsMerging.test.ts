import { FluentEntity } from "../FluentEntity";

/**
 * Tests to achieve 100% branch coverage for FluentEntity.ts
 * Targeting remaining lines: 111, 126, 143 (nullish coalescing operators)
 */

describe("FluentEntity Final Branch Coverage", () => {
  
  describe("Nullish Coalescing Branch Coverage", () => {
    
    test("Lines 111, 126, 143: options with no jsonapi property", async () => {
      const mockService = {
        listPage: jest.fn().mockResolvedValue({ 
          items: [{ id: "1", type: "test", attributes: {} }], 
          page: {} 
        }),
        load: jest.fn().mockResolvedValue({ id: "test-id", type: "test", attributes: {} }),
        list: jest.fn().mockResolvedValue([{ id: "1" }, { id: "2" }])
      };
      
      const fluentEntity = new FluentEntity(mockService as any, { entity: "node", bundle: "article" });
      
      // Test options without jsonapi property to hit the ?? {} branches
      const optionsWithoutJsonApi = {
        someOtherProperty: "value"
        // No jsonapi property - this should trigger options?.jsonapi?.query ?? {} branch
      };
      
      // Line 111: listPage options merging
      await fluentEntity.listPage(optionsWithoutJsonApi as any);
      
      // Line 126: get options merging
      await fluentEntity.id("test-id").get(optionsWithoutJsonApi as any);
      
      // Line 143: count options merging
      await fluentEntity.count(optionsWithoutJsonApi as any);
      
      // Verify that the options were properly merged with empty jsonapi.query
      expect(mockService.listPage).toHaveBeenCalledWith(
        { entity: "node", bundle: "article" },
        expect.objectContaining({
          someOtherProperty: "value",
          jsonapi: { query: {} }
        })
      );
      
      expect(mockService.load).toHaveBeenCalledWith(
        { entity: "node", bundle: "article" },
        "test-id",
        expect.objectContaining({
          someOtherProperty: "value", 
          jsonapi: { query: {} }
        })
      );
      
      expect(mockService.list).toHaveBeenCalledWith(
        { entity: "node", bundle: "article" },
        expect.objectContaining({
          someOtherProperty: "value",
          jsonapi: { query: {} }
        })
      );
    });

    test("Lines 111, 126, 143: null externalParams branch", async () => {
      const mockService = {
        listPage: jest.fn().mockResolvedValue({ items: [], page: {} }),
        load: jest.fn().mockResolvedValue({ id: "1", type: "test", attributes: {} }),
        list: jest.fn().mockResolvedValue([])
      };
      
      const fluentEntity = new FluentEntity(mockService as any, { entity: "node", bundle: "article" });
      
      // Set externalParams to null to test the this.externalParams ?? {} branch
      (fluentEntity as any).externalParams = null;
      
      const options = {
        jsonapi: { 
          query: { include: "field_test" }
        }
      };
      
      await fluentEntity.listPage(options);
      await fluentEntity.id("test").get(options);
      await fluentEntity.count(options);
      
      // All should execute without errors despite null externalParams
      expect(mockService.listPage).toHaveBeenCalledWith(
        { entity: "node", bundle: "article" },
        expect.objectContaining({
          jsonapi: { 
            query: expect.objectContaining({
              include: "field_test"
            })
          }
        })
      );
    });

    test("Lines 111, 126, 143: undefined options parameter", async () => {
      const mockService = {
        listPage: jest.fn().mockResolvedValue({ items: [], page: {} }),
        load: jest.fn().mockResolvedValue({ id: "1", type: "test", attributes: {} }),
        list: jest.fn().mockResolvedValue([])
      };
      
      const fluentEntity = new FluentEntity(mockService as any, { entity: "node", bundle: "article" });
      
      // Call without any options parameter to test ...options behavior
      await fluentEntity.listPage();
      await fluentEntity.id("test").get();
      await fluentEntity.count();
      
      // Should use default empty options
      expect(mockService.listPage).toHaveBeenCalledWith(
        { entity: "node", bundle: "article" },
        { jsonapi: { query: {} } }
      );
      
      expect(mockService.load).toHaveBeenCalledWith(
        { entity: "node", bundle: "article" },
        "test",
        { jsonapi: { query: {} } }
      );
      
      expect(mockService.list).toHaveBeenCalledWith(
        { entity: "node", bundle: "article" },
        { jsonapi: { query: {} } }
      );
    });

    test("Lines 111, 126, 143: complex options merging scenarios", async () => {
      const mockService = {
        listPage: jest.fn().mockResolvedValue({ items: [], page: {} }),
        load: jest.fn().mockResolvedValue({ id: "1", type: "test", attributes: {} }),
        list: jest.fn().mockResolvedValue([])
      };
      
      const fluentEntity = new FluentEntity(mockService as any, { entity: "node", bundle: "article" });
      
      // Add some external params first
      fluentEntity.params({ include: "external_field" });
      
      // Test with options that have jsonapi.query but missing some properties
      const partialOptions = {
        jsonapi: {
          // query property is missing - should test options?.jsonapi?.query ?? {}
        },
        otherProperty: "test"
      };
      
      await fluentEntity.listPage(partialOptions as any);
      await fluentEntity.id("test").get(partialOptions as any);
      await fluentEntity.count(partialOptions as any);
      
      // Should merge external params with empty query
      expect(mockService.listPage).toHaveBeenCalledWith(
        { entity: "node", bundle: "article" },
        expect.objectContaining({
          otherProperty: "test",
          jsonapi: { 
            query: expect.objectContaining({
              include: "external_field"
            })
          }
        })
      );
    });
  });

  describe("Edge Cases for Complete Branch Coverage", () => {
    test("should handle all nullish scenarios in options merging", async () => {
      const mockService = {
        listPage: jest.fn().mockResolvedValue({ items: [], page: {} }),
        load: jest.fn().mockResolvedValue({ id: "1", type: "test", attributes: {} }),
        list: jest.fn().mockResolvedValue([])
      };
      
      const fluentEntity = new FluentEntity(mockService as any, { entity: "node", bundle: "article" });
      
      // Test all combinations of null/undefined for comprehensive coverage
      const scenarios = [
        undefined, // No options at all
        {}, // Empty options
        { jsonapi: {} }, // Empty jsonapi
        { jsonapi: { query: undefined } }, // Undefined query
        { jsonapi: { query: null } }, // Null query
        { params: { test: "value" } }, // Only params, no jsonapi
      ];

      for (const [index, scenario] of scenarios.entries()) {
        // Reset mocks
        mockService.listPage.mockClear();
        mockService.load.mockClear();
        mockService.list.mockClear();
        
        await fluentEntity.listPage(scenario as any);
        await fluentEntity.id(`test-${index}`).get(scenario as any);
        await fluentEntity.count(scenario as any);
        
        // All should execute without errors
        expect(mockService.listPage).toHaveBeenCalled();
        expect(mockService.load).toHaveBeenCalled();
        expect(mockService.list).toHaveBeenCalled();
      }
    });
  });
});
