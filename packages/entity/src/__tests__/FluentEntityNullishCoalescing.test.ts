/**
 * Tests for FluentEntity parameter handling edge cases.
 * Ensures robust behavior when dealing with null/undefined parameters and query options.
 */

import { FluentEntity } from "../FluentEntity";
import { attachRelations } from "../relations";

describe("FluentEntity Parameter Handling", () => {
  describe("External Parameter Merging", () => {
    test("should handle fromParams when external parameters are null", () => {
      const mockService = { load: jest.fn() };
      const fluentEntity = new FluentEntity(mockService as any, {
        entity: "node",
        bundle: "article",
      });

      // Simulate a scenario where external parameters are null
      (fluentEntity as any).externalParams = null;

      const result = fluentEntity.fromParams({
        getQueryObject: () => ({ include: "field_test" }),
      });

      expect(result).toBe(fluentEntity);
      expect((fluentEntity as any).externalParams).toEqual({ include: "field_test" });
    });

    test("should handle fromParams with undefined parameter object", () => {
      const mockService = { load: jest.fn() };
      const fluentEntity = new FluentEntity(mockService as any, {
        entity: "node",
        bundle: "article",
      });

      const result = fluentEntity.fromParams(undefined as any);
      expect(result).toBe(fluentEntity);
    });

    test("should handle query options without jsonapi property", async () => {
      const mockService = {
        listPage: jest.fn().mockResolvedValue({ items: [], page: {} }),
        load: jest.fn().mockResolvedValue({ id: "1", type: "test", attributes: {} }),
        list: jest.fn().mockResolvedValue([]),
      };

      const fluentEntity = new FluentEntity(mockService as any, {
        entity: "node",
        bundle: "article",
      });

      // Test options with undefined jsonapi property to hit options?.jsonapi?.query ?? {} branch
      const optionsWithoutJsonApi = { someOtherProperty: "value" };

      await fluentEntity.listPage(optionsWithoutJsonApi as any);
      await fluentEntity.id("test").get(optionsWithoutJsonApi as any);
      await fluentEntity.count(optionsWithoutJsonApi as any);

      // Verify calls were made with the correct merged options
      expect(mockService.listPage).toHaveBeenCalledWith(
        { entity: "node", bundle: "article" },
        expect.objectContaining({
          someOtherProperty: "value",
          jsonapi: { query: {} },
        })
      );
    });

    test("should handle operations when external parameters are null", async () => {
      const mockService = {
        listPage: jest.fn().mockResolvedValue({ items: [], page: {} }),
        load: jest.fn().mockResolvedValue({ id: "1", type: "test", attributes: {} }),
        list: jest.fn().mockResolvedValue([]),
      };

      const fluentEntity = new FluentEntity(mockService as any, {
        entity: "node",
        bundle: "article",
      });

      // Simulate state where external parameters are null
      (fluentEntity as any).externalParams = null;

      await fluentEntity.listPage();
      await fluentEntity.id("test").get();
      await fluentEntity.count();

      // All should work without errors despite null externalParams
      expect(mockService.listPage).toHaveBeenCalled();
      expect(mockService.load).toHaveBeenCalled();
      expect(mockService.list).toHaveBeenCalled();
    });
  });

  describe("Relationship Data Handling", () => {
    test("should handle relationship linkage with null/undefined values", async () => {
      // Test relationship handling when linkage data contains null/undefined values
      const mockService = {
        load: jest.fn().mockResolvedValue({ id: "test", type: "test", attributes: {} }),
        list: jest.fn().mockResolvedValue([]),
      };

      const recordWithNullValues = {
        id: "test-record",
        type: "node--article",
        attributes: { title: "Test" },
        relationships: {
          field_ref: {
            data: {
              type: null,
              id: null,
            },
          },
        },
      };

      const recordWithRel = attachRelations(recordWithNullValues, mockService as any, {
        entity: "node",
        bundle: "article",
      });

      // This will trigger the nullish coalescing operators
      const relations = await recordWithRel.rel("field_ref").load();

      // The main goal is to exercise the code paths, not verify exact service calls
      expect(relations).toBeDefined();
      expect(Array.isArray(relations)).toBe(true);
    });
  });

  describe("Edge Case Parameter Scenarios", () => {
    test("should handle FluentEntity with various null/undefined parameter conditions", () => {
      const mockService = { load: jest.fn() };
      const fluentEntity = new FluentEntity(mockService as any, {
        entity: "node",
        bundle: "article",
      });

      // Test multiple nullish scenarios
      fluentEntity.fromParams(null as any);
      fluentEntity.fromParams({ getQueryObject: null } as any);
      fluentEntity.fromParams({ getQueryObject: undefined } as any);
      fluentEntity.fromParams({} as any); // No getQueryObject property

      expect(fluentEntity).toBeInstanceOf(FluentEntity);
    });

    test("should handle relationships with various null/undefined scenarios", async () => {
      const mockService = {
        load: jest.fn().mockResolvedValue({ id: "loaded", type: "test", attributes: {} }),
        list: jest.fn().mockResolvedValue([]),
      };

      // Test that nullish coalescing operators are exercised
      const record = {
        id: "test-record",
        type: "node--article",
        attributes: { title: "Test" },
        relationships: {
          field_test: {
            data: {
              type: null, // Test null type handling
              id: null, // Test null ID handling
            },
          },
        },
      };

      const recordWithRel = attachRelations(record, mockService as any, {
        entity: "node",
        bundle: "article",
      });

      // Verify relationships work even with malformed linkage data
      const relations = await recordWithRel.rel("field_test").load();
      expect(relations).toBeDefined();
    });
  });
});
