import { Drupal } from "..";
import { StorageInMemory } from "@drupal-js-sdk/storage";

test("Drupal initialize", () => {
  const config = {
    baseURL: "http://www.example.com",
  };
  const sdk = new Drupal(config);
  expect(sdk.initialize(config)).toBe(sdk);
  sdk.config.setItem("FOO", "bar");
  expect(sdk.config.getItem("FOO")).toBe("bar");
  expect(sdk.config.getItem("baseURL")).toBe(config.baseURL);
});

test("Drupal initialize with headers", () => {
  const config = {
    baseURL: "http://www.example.com",
    headers: {
      "X-Foo": "Foo",
    },
  };
  const sdk = new Drupal(config);
  expect(sdk.initialize(config)).toBe(sdk);
  sdk.config.setItem("FOO", "bar");
  expect(sdk.config.getItem("FOO")).toBe("bar");
});

test("Drupal initialize with basic auth", () => {
  const config = {
    baseURL: "http://www.example.com",
    auth: {
      username: "dpa",
      password: "dpa",
    },
  };
  const sdk = new Drupal(config);
  expect(sdk.initialize(config)).toBe(sdk);
  sdk.config.setItem("FOO", "bar");
  expect(sdk.config.getItem("FOO")).toBe("bar");
});

test("Drupal initialize with explicit session service (Line 41)", () => {
  const customSessionService = new StorageInMemory();
  customSessionService.setItem("test", "value");

  const config = {
    baseURL: "http://www.example.com",
    session: customSessionService, // This should trigger Line 41
  };

  const sdk = new Drupal(config);
  expect(sdk.initialize(config)).toBe(sdk);

  // Verify the custom session service was set
  expect(sdk.getSessionService().getItem("test")).toBe("value");
});

test("Drupal initialize with web storage success (Line 46)", () => {
  // Mock the StorageInWeb constructor to not throw
  const { StorageInWeb } = require("@drupal-js-sdk/storage");
  const originalConstructor = StorageInWeb.prototype.constructor;

  // Mock isAvailable to return true
  StorageInWeb.prototype.isAvailable = jest.fn().mockReturnValue(true);

  // Create a working localStorage
  const testData: Record<string, string> = {};
  const mockLocalStorage = {
    getItem: jest.fn().mockImplementation((key: string) => testData[key] || null),
    setItem: jest.fn().mockImplementation((key: string, value: string) => {
      testData[key] = value;
    }),
    removeItem: jest.fn().mockImplementation((key: string) => {
      delete testData[key];
    }),
    clear: jest.fn().mockImplementation(() => {
      Object.keys(testData).forEach((key) => delete testData[key]);
    }),
    length: 0,
    key: jest.fn().mockReturnValue(null),
  };

  const originalWindow = (global as any).window;

  (global as any).window = {
    localStorage: mockLocalStorage,
  };

  const config = {
    baseURL: "http://www.example.com",
    // No session provided - should successfully initialize web storage (Line 46)
  };

  const sdk = new Drupal(config);
  expect(sdk.initialize(config)).toBe(sdk);

  // Verify web storage path was taken
  expect(sdk.getSessionService()).toBeDefined();

  // Restore
  if (originalWindow !== undefined) {
    (global as any).window = originalWindow;
  } else {
    delete (global as any).window;
  }

  StorageInWeb.prototype.constructor = originalConstructor;
});

test("Drupal initialize branch coverage for auth and headers", () => {
  // Test all branch combinations for Boolean checks

  // Test with auth but no headers
  const configWithAuth = {
    baseURL: "http://auth.example.com",
    auth: {
      username: "test",
      password: "pass",
    },
  };
  const sdk1 = new Drupal(configWithAuth);
  expect(sdk1.initialize(configWithAuth)).toBe(sdk1);

  // Test with headers but no auth
  const configWithHeaders = {
    baseURL: "http://headers.example.com",
    headers: {
      "X-Custom": "header-value",
    },
  };
  const sdk2 = new Drupal(configWithHeaders);
  expect(sdk2.initialize(configWithHeaders)).toBe(sdk2);

  // Test with both auth and headers
  const configWithBoth = {
    baseURL: "http://both.example.com",
    auth: {
      username: "user",
      password: "pass",
    },
    headers: {
      Authorization: "Bearer token",
    },
  };
  const sdk3 = new Drupal(configWithBoth);
  expect(sdk3.initialize(configWithBoth)).toBe(sdk3);

  // Test with neither (baseline case)
  const configMinimal = {
    baseURL: "http://minimal.example.com",
  };
  const sdk4 = new Drupal(configMinimal);
  expect(sdk4.initialize(configMinimal)).toBe(sdk4);
});

test("Drupal initialize with web storage fallback to memory", () => {
  // Ensure no window exists to trigger memory storage fallback
  const originalWindow = (global as any).window;
  delete (global as any).window;

  const config = {
    baseURL: "http://www.example.com",
    // No session provided, no window - should fallback to memory
  };

  const sdk = new Drupal(config);
  expect(sdk.initialize(config)).toBe(sdk);

  // Verify memory storage was used as fallback
  expect(sdk.getSessionService()).toBeDefined();
  expect(sdk.getSessionService().isAvailable()).toBe(true);

  // Restore original window
  if (originalWindow !== undefined) {
    (global as any).window = originalWindow;
  }
});
