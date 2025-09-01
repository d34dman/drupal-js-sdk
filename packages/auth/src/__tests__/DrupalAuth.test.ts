import { Drupal } from "@drupal-js-sdk/core";
import { DrupalAuth } from "..";
import { StorageInMemory } from "@drupal-js-sdk/storage";
import { AxiosClient } from "@drupal-js-sdk/xhr";
import { XhrRequestConfig, XhrResponse } from "@drupal-js-sdk/interfaces";

const mockData: { [key: string]: any } = {
  login: {
    admin: {
      current_user: {
        uid: "1",
        roles: ["authenticated"],
        name: "admin",
      },
      csrf_token: "mock-session-token-from-login",
      logout_token: "8av5mgYDgJ7bKS2seVtIK3trLIuqsh4WycFL8w4qCKs",
    },
  },
  valid: {},
  register: {
    newUser: {
      uid: [{ value: 19 }],
      uuid: [{ value: "a02000bf-eff5-41f6-9a8d-f3cf3199dc2d" }],
      langcode: [{ value: "en" }],
      name: [{ value: "fooBar" }],
      created: [{ value: "2021-05-26T20:16:26+00:00", format: "Y-m-d\\TH:i:sP" }],
      changed: [{ value: "2021-05-26T20:16:26+00:00", format: "Y-m-d\\TH:i:sP" }],
      default_langcode: [{ value: true }], // eslint-disable-line @typescript-eslint/naming-convention
      user_picture: [],
    }, // eslint-disable-line @typescript-eslint/naming-convention
  },
};

// Minimal axios-like stub compatible with AxiosClient HttpClientLike
const createStubClient = () => ({
  request: <T = unknown, D = unknown>(config: XhrRequestConfig<D>): Promise<XhrResponse<T, D>> => {
    const method = (config.method ?? "get").toString().toLowerCase();
    const url = config.url ?? "";
    const mk = (data: unknown, status = 200, statusText = "OK"): XhrResponse<unknown, D> => ({
      data,
      status,
      statusText,
      headers: {},
      config,
      request: {},
    });
    if (method === "get" && url === "/session/token") {
      return Promise.resolve(mk("mock-session-token") as XhrResponse<T, D>);
    }
    if (method === "get" && url === "/user/login_status") {
      return Promise.resolve(mk(0) as XhrResponse<T, D>);
    }
    if (method === "post" && url === "/user/login") {
      return Promise.resolve(mk(mockData.login.admin) as XhrResponse<T, D>);
    }
    if (method === "post" && url === "/user/logout") {
      return Promise.resolve(mk("", 204, "No Content") as XhrResponse<T, D>);
    }
    if (method === "get" && url === "/user/logout") {
      return Promise.resolve(mk("") as XhrResponse<T, D>);
    }
    if (method === "post" && url === "/user/register") {
      return Promise.resolve(mk(mockData.register.newUser) as XhrResponse<T, D>);
    }
    if (method === "post" && url === "/user/password") {
      return Promise.resolve(mk("") as XhrResponse<T, D>);
    }
    return Promise.resolve(mk(null) as XhrResponse<T, D>);
  },
});

test("Drupal Auth login and logout", async () => {
  const config = {
    baseURL: "http://www.example.com",
  };
  const sdk = new Drupal(config);
  const client = new AxiosClient(createStubClient());
  sdk.setClientService(client);
  sdk.setSessionService(new StorageInMemory());
  const auth = new DrupalAuth(sdk);
  await auth.getSessionToken();
  expect(auth.store.csrf_token).toEqual("mock-session-token");
  expect(await auth.loginStatus()).toEqual(false);
  expect.assertions(9);
  return auth
    .login("admin", "admin")
    .then((response) => {
      expect(response.data).toHaveProperty("csrf_token");
      expect(response.data).toHaveProperty("current_user");
      expect(response.data).toHaveProperty("logout_token");
      expect(auth.store.csrf_token).toEqual(mockData.login.admin.csrf_token);
      expect(auth.store.current_user).toEqual(mockData.login.admin.current_user);
      expect(auth.store.logout_token).toEqual(mockData.login.admin.logout_token);
    })
    .then(async () => {
      const { status } = await auth.logout();
      expect(status).toEqual(204);
    });
});

test("Drupal Auth Forced logout", async () => {
  const config = {
    baseURL: "http://www.example.com",
  };
  const sdk = new Drupal(config);
  const client = new AxiosClient(createStubClient());
  sdk.setClientService(client);
  sdk.setSessionService(new StorageInMemory());
  const auth = new DrupalAuth(sdk);
  const status = await auth.forcedLogout();
  expect(status).toEqual(true);
  await auth.getSessionToken();
  expect.assertions(2);
  return auth.login("admin", "admin").then(async () => {
    const status = await auth.forcedLogout();
    expect(status).toEqual(true);
  });
});

test("Drupal Auth password reset", async () => {
  const config = {
    baseURL: "http://www.example.com",
  };
  const sdk = new Drupal(config);
  const client = new AxiosClient(createStubClient());
  sdk.setClientService(client);
  sdk.setSessionService(new StorageInMemory());
  const auth = new DrupalAuth(sdk);
  await auth.getSessionToken();
  await auth.passwordResetByMail("admin@example.com").then((response) => {
    expect(response.status).toBe(200);
  });
  await auth.passwordResetByUserName("admin").then((response) => {
    expect(response.status).toBe(200);
  });
});

test("Drupal Auth register", async () => {
  const config = {
    baseURL: "http://www.example.com",
  };
  const sdk = new Drupal(config);
  const client = new AxiosClient(createStubClient());
  sdk.setClientService(client);
  sdk.setSessionService(new StorageInMemory());
  const auth = new DrupalAuth(sdk);
  await auth.getSessionToken();
  await auth.register("admin", "admin@example.com").then((response) => {
    expect(response.status).toBe(200);
  });
});

test("Drupal Auth login with restore session", async () => {
  const config = {
    baseURL: "http://www.example.com",
  };
  const sdk = new Drupal(config);
  const client = new AxiosClient(createStubClient());
  sdk.setClientService(client);
  const sessionStorage = new StorageInMemory();
  sdk.setSessionService(sessionStorage);
  const auth = new DrupalAuth(sdk);
  await auth.getSessionToken();
  expect(auth.store.csrf_token).toEqual("mock-session-token");
  expect(await auth.loginStatus()).toEqual(false);
  await auth.login("admin", "admin");
  expect(auth.store.current_user).toEqual(mockData.login.admin.current_user);

  const sdk2 = new Drupal(config);
  sdk2.setSessionService(sessionStorage);

  const auth2 = new DrupalAuth(sdk);
  expect(auth2.store.current_user).toEqual(mockData.login.admin.current_user);
});

test("Drupal Auth init method coverage (Line 42)", async () => {
  const config = {
    baseURL: "http://www.example.com",
  };
  const sdk = new Drupal(config);
  const client = new AxiosClient(createStubClient());
  sdk.setClientService(client);
  sdk.setSessionService(new StorageInMemory());
  const auth = new DrupalAuth(sdk);

  // This should cover Line 42: await this.getSessionToken()
  await auth.init();

  expect(auth.store.csrf_token).toBe("mock-session-token");
});

test("Drupal Auth refreshUserSession method coverage (Line 58)", async () => {
  const config = {
    baseURL: "http://www.example.com",
  };
  const sdk = new Drupal(config);
  const client = new AxiosClient(createStubClient());
  sdk.setClientService(client);
  sdk.setSessionService(new StorageInMemory());
  const auth = new DrupalAuth(sdk);

  // This should cover Line 58: return this.getSessionToken()
  const response = await auth.refreshUserSession();

  expect(response.data).toBe("mock-session-token");
  expect(response.status).toBe(200);
});

test("Drupal Auth logout with undefined tokens (Lines 137, 149)", async () => {
  const config = {
    baseURL: "http://www.example.com",
  };
  const sdk = new Drupal(config);
  const client = new AxiosClient(createStubClient());
  sdk.setClientService(client);
  sdk.setSessionService(new StorageInMemory());
  const auth = new DrupalAuth(sdk);

  // Clear the store to have undefined tokens
  auth.store = {
    csrf_token: undefined, // This should trigger the ?? '' branch on line 149
    logout_token: undefined, // This should trigger the ?? '' branch on line 137
  };

  const response = await auth.logout();

  expect(response.status).toBe(204);
});

test("Drupal Auth logout with null tokens (branch coverage)", async () => {
  const config = {
    baseURL: "http://www.example.com",
  };
  const sdk = new Drupal(config);
  const client = new AxiosClient(createStubClient());
  sdk.setClientService(client);
  sdk.setSessionService(new StorageInMemory());
  const auth = new DrupalAuth(sdk);

  // Set tokens to null to test the other branch
  auth.store = {
    csrf_token: null as any, // Test null branch
    logout_token: null as any, // Test null branch
  };

  const response = await auth.logout();

  expect(response.status).toBe(204);
});

test("Drupal Auth logout with existing tokens (normal path)", async () => {
  const config = {
    baseURL: "http://www.example.com",
  };
  const sdk = new Drupal(config);
  const client = new AxiosClient(createStubClient());
  sdk.setClientService(client);
  sdk.setSessionService(new StorageInMemory());
  const auth = new DrupalAuth(sdk);

  // Set actual tokens to test the non-coalesced path
  auth.store = {
    csrf_token: "actual-csrf-token",
    logout_token: "actual-logout-token",
  };

  const response = await auth.logout();

  expect(response.status).toBe(204);
});
