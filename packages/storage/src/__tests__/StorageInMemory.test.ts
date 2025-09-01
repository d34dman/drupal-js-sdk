import { DrupalError } from "@drupal-js-sdk/error";
import { StorageInMemory } from "../StorageInMemory";

test("StorageBase", () => {
  const storage = new StorageInMemory();
  storage.setItem("FOO", "BAR");
  expect(storage.getItem("FOO")).toBe("BAR");
  storage.setItem("BAR", "BAZ");
  expect(storage.getItem("BAR")).toBe("BAZ");
  storage.setItem("FOO", "BAZ");
  expect(storage.getItem("FOO")).toBe("BAZ");
  storage.removeItem("FOO");
  expect(storage.getItem("FOO")).toBe(null);
  storage.clear();
  expect(storage.getItem("FOO")).toBe(null);
  expect(storage.get()).toStrictEqual({});
});

test("StorageBase Errors", () => {
  const storage = new StorageInMemory();
  expect(storage.isAvailable()).toBe(true);
  jest.spyOn(storage, "setItem").mockImplementation();
  expect(storage.isAvailable()).toBe(false);
  jest.clearAllMocks();
  jest.spyOn(StorageInMemory.prototype, "setItem").mockImplementation(() => {
    throw new Error("FOO");
  });
  try {
    new StorageInMemory();
  } catch (error) {
    expect(error).toBeInstanceOf(DrupalError);
  }
  expect.assertions(3);
  jest.clearAllMocks();
});
