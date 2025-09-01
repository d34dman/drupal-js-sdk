import { FetchClient } from "..";
import { XhrRequestConfig } from "@drupal-js-sdk/interfaces";

const fakeData = { foo: "bar" };

// Enhance mock fetch to support status and headers
function mkResponse(init?: Partial<Response>) {
  return {
    ok: init?.ok ?? 1,
    status: init?.status ?? 200,
    statusText: init?.statusText ?? "ok",
    headers: new Map(Object.entries(init?.headers ?? {})) as any,
    json: () => Promise.resolve(init?.json ?? fakeData),
    text: () => Promise.resolve(JSON.stringify(init?.json ?? fakeData)),
  } as unknown as Response;
}

global.fetch = jest.fn(() => Promise.resolve(mkResponse())) as jest.Mock;

test("Default", async () => {
  const config = {
    baseURL: "https://drupal-js-sdk-demo.d34dman.com",
  };
  const client = new FetchClient(config);
  const res1 = await client.call("GET", "/system/menu/main/linkset");
  expect(res1.data).toEqual(fakeData);
  expect(res1.request.path).toEqual(
    "https://drupal-js-sdk-demo.d34dman.com/system/menu/main/linkset"
  );

  const axiosClient = new FetchClient();
  const config2 = {
    baseURL: "https://umami.swis.nl",
  };
  const res2 = await axiosClient.call("GET", "/system/menu/main/linkset", config2);

  expect(res2.data).toEqual(fakeData);
  expect(res2.request.path).toEqual("https://umami.swis.nl/system/menu/main/linkset");
});

test("Identify and set path for the request.", async () => {
  const config = {
    baseURL: "https://abc.example.com",
  };
  const client = new FetchClient(config);
  const res1 = await client.call("GET", "/system/menu/main/linkset");
  expect(res1.request.path).toEqual("https://abc.example.com/system/menu/main/linkset");

  const config2 = {};
  const client2 = new FetchClient(config2);
  const res2 = await client2.call("GET", "/system/menu/main/linkset");
  expect(res2.request.path).toEqual("/system/menu/main/linkset");

  const config3 = {
    baseURL: "https://abc.example.com",
  };
  const client3 = new FetchClient(config3);

  const res3 = await client3.call("GET", "");

  expect(res3.request.path).toEqual("https://abc.example.com");

  const config4 = {
    baseURL: "https://abc.example.com",
  };
  const client4 = new FetchClient(config4);
  const res4 = await client4.call("GET", "https://xyz.example.com");
  expect(res4.request.path).toEqual("https://xyz.example.com");

  const config5 = {};
  const client5 = new FetchClient(config5);
  const res5 = await client5.call("GET", "https://xyz.example.com");
  expect(res5.request.path).toEqual("https://xyz.example.com");
});

test("Add Headers", async () => {
  const config = {
    baseURL: "https://drupal-js-sdk-demo.d34dman.com",
  };
  const client = new FetchClient(config);
  expect(client.getClient()).toBe(fetch);
  expect(client.addDefaultHeaders({ foo: "bar", bar: "baz" })).toBe(client);
  const response = await client.call("GET", "/system/menu/main/linkset");
  expect(response.config.headers).toMatchObject({ foo: "bar", bar: "baz" });
});

test("With Credentials", async () => {
  const config = {
    baseURL: "https://abc.example.com",
    withCredentials: true,
  };
  const client = new FetchClient(config);
  const res1 = await client.call("GET", "/system/menu/main/linkset");
  expect(res1.request.path).toEqual("https://abc.example.com/system/menu/main/linkset");
  expect(res1.request).toMatchObject({ credentials: "include" });
});

test("Basic Auth in node env", async () => {
  const config: XhrRequestConfig = {
    baseURL: "https://abc.example.com",
    withCredentials: true,
    auth: {
      username: "foo",
      password: "bar",
    },
  };
  const client = new FetchClient(config);
  const res1 = await client.call("GET", "/fake-path");
  expect(res1.request).toMatchObject({ headers: { Authorization: "Basic Zm9vOmJhcg==" } });
});

test("Retry/backoff and AbortSignal", async () => {
  const fn = jest
    .fn()
    .mockResolvedValueOnce(mkResponse({ ok: false, status: 503 }))
    .mockResolvedValueOnce(mkResponse());
  (global.fetch as jest.Mock).mockImplementation(fn);
  const client = new FetchClient({ baseURL: "https://retry.example.com" });
  const res = await client.call("GET", "/x", { retry: { retries: 1 } });
  expect(res.status).toBe(200);

  // Abort
  const controller = new AbortController();
  (global.fetch as jest.Mock).mockImplementation(
    () => new Promise((_, reject) => setTimeout(() => reject(new Error("aborted")), 5))
  );
  const p = new FetchClient({ baseURL: "https://abort.example.com" }).call("GET", "/y", {
    signal: controller.signal,
    timeoutMs: 1,
  });
  await expect(p).rejects.toBeTruthy();
});

test("Body types: ArrayBuffer and ReadableStream (noop)", async () => {
  // Reset fetch to success response after previous tests may have changed it
  (global.fetch as jest.Mock).mockImplementation(() => Promise.resolve(mkResponse()));
  const client = new FetchClient({ baseURL: "https://body.example.com" });
  const ab = new ArrayBuffer(8);
  await client.call("POST", "/ab", { data: ab });
  const stream = new ReadableStream();
  await client.call("POST", "/rs", { data: stream as any });
  expect(true).toBe(true);
});

test("Additional coverage tests", async () => {
  const client = new FetchClient({ baseURL: "https://coverage.example.com" });

  // Reset to default implementation for clean testing
  (global.fetch as jest.Mock).mockImplementation(() => Promise.resolve(mkResponse()));

  // Test error response
  (global.fetch as jest.Mock).mockImplementation(() =>
    Promise.resolve(mkResponse({ ok: false, status: 400 }))
  );

  await expect(client.call("GET", "/error-test")).rejects.toBeTruthy();
});

test("Additional error handling", async () => {
  const client = new FetchClient({ baseURL: "https://error.example.com" });

  // Test error response
  (global.fetch as jest.Mock).mockImplementation(() =>
    Promise.resolve(mkResponse({ ok: false, status: 500 }))
  );

  await expect(client.call("GET", "/server-error")).rejects.toBeTruthy();
});

test("Additional method testing", async () => {
  const client = new FetchClient({ baseURL: "https://methods.example.com" });

  // Reset to successful response
  (global.fetch as jest.Mock).mockImplementation(() => Promise.resolve(mkResponse()));

  // Test different HTTP methods for coverage
  await client.call("PUT", "/put-test");
  await client.call("DELETE", "/delete-test");
  await client.call("PATCH", "/patch-test");

  expect(true).toBe(true);
});
