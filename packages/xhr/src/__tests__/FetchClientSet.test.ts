import { FetchClient } from "..";
import fetch2 from "cross-fetch";

const fakeData = { foo: "bar" };

global.fetch = jest.fn(() =>
  Promise.resolve({
    data: JSON.stringify(fakeData),
    ok: 1,
    status: 200,
    statusText: "ok",
    json: () => Promise.resolve(fakeData),
  })
) as jest.Mock;

test("setclient", async () => {
  const config = {
    baseURL: "https://drupal-js-sdk-demo.d34dman.com",
  };
  const client = new FetchClient(config);
  expect(client.getClient()).toBe(fetch);
  expect(client.setClient(fetch2)).toBe(client);
  expect(client.getClient()).toBe(fetch2);
  expect(client.setClient()).toBe(client);
  expect(client.getClient()).toBe(fetch);
});
