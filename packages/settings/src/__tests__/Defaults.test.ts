import { DrupalSettings } from "..";
import { DrupalError } from "@drupal-js-sdk/error";

test("Drupal Role : Test for un-implemented thing to throw", () => {
  const role = new DrupalSettings();
  expect(() => {
    role.get("foo");
  }).toThrow(DrupalError);
});
