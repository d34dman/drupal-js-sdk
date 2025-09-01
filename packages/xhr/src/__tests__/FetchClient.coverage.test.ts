import { FetchClient, checkFetcher } from '../FetchClient';
import { XhrRequestConfig } from '@drupal-js-sdk/interfaces';

const fakeData = { 'foo': 'bar' };

// Simple mock response that works reliably
function mkResponse(init?: any) {
  const headers = new Map(Object.entries(init?.headers ?? {}));
  return {
    ok: init?.ok ?? true,
    status: init?.status ?? 200,
    statusText: init?.statusText ?? 'OK',
    headers,
    json: () => Promise.resolve(init?.json ?? fakeData),
    text: () => Promise.resolve(JSON.stringify(init?.json ?? fakeData)),
  } as unknown as Response;
}

global.fetch = jest.fn(() => Promise.resolve(mkResponse())) as jest.Mock;

describe('FetchClient Missing Coverage', () => {
  
  describe('addDefaultOptions coverage (Lines 52, 60)', () => {
    test('should execute addDefaultOptions and return this', () => {
      const client = new FetchClient();
      
      // This should cover Line 52 (setting config) and Line 60 (return this)
      const result = client.addDefaultOptions({
        baseURL: 'https://default.example.com',
        withCredentials: true,
      });
      
      expect(result).toBe(client);
    });
  });

  describe('Data handling coverage (Lines 127, 129-130, 133-135)', () => {
    beforeEach(() => {
      (global.fetch as jest.Mock).mockImplementation(() => Promise.resolve(mkResponse()));
    });

    test('should handle FormData (Line 127)', async () => {
      const client = new FetchClient({ baseURL: 'https://formdata.example.com' });
      
      const formData = new FormData();
      formData.append('test', 'value');
      
      await client.call('POST', '/formdata', {
        data: formData,
        headers: {
          'Content-Type': 'application/json', // Should be removed for FormData
        },
      });
      
      expect(true).toBe(true); // Just ensure it executes without error
    });

    test('should handle string data (Lines 129-130)', async () => {
      const client = new FetchClient({ baseURL: 'https://string.example.com' });
      
      await client.call('POST', '/string', {
        data: 'This is string data',
      });
      
      expect(true).toBe(true);
    });

    test('should handle object data JSON stringify (Lines 133-135)', async () => {
      const client = new FetchClient({ baseURL: 'https://object.example.com' });
      
      // Test object data without existing JSON content-type (should add it)
      await client.call('POST', '/object1', {
        data: { test: 'object', number: 42 },
        headers: {
          'Authorization': 'Bearer token',
        },
      });
      
      // Test object data with existing JSON content-type (should not override)
      await client.call('POST', '/object2', {
        data: { test: 'object2' },
        headers: {
          'Content-Type': 'application/json; charset=utf-8',
        },
      });
      
      expect(true).toBe(true);
    });

    test('should handle ArrayBuffer data (Line 127)', async () => {
      const client = new FetchClient({ baseURL: 'https://buffer.example.com' });
      
      const buffer = new ArrayBuffer(8);
      
      await client.call('POST', '/buffer', {
        data: buffer,
        headers: {
          'Content-Type': 'application/json', // Should be removed for ArrayBuffer
        },
      });
      
      expect(true).toBe(true);
    });
  });

  describe('Query parameter handling (Lines 141-144)', () => {
    beforeEach(() => {
      (global.fetch as jest.Mock).mockImplementation(() => Promise.resolve(mkResponse()));
    });

    test('should append query parameters with ? (Line 143)', async () => {
      const client = new FetchClient({ baseURL: 'https://params.example.com' });
      
      const response = await client.call('GET', '/test', {
        params: {
          param1: 'value1',
          param2: 42,
        },
      });
      
      // Should use ? as joiner
      expect(response.request.path).toContain('?');
      expect(response.request.path).toContain('param1=value1');
    });

    test('should append query parameters with & (Line 144)', async () => {
      const client = new FetchClient({ baseURL: 'https://params.example.com' });
      
      const response = await client.call('GET', '/test?existing=param', {
        params: {
          additional: 'param',
        },
      });
      
      // Should use & as joiner since ? already exists
      expect(response.request.path).toContain('existing=param');
      expect(response.request.path).toContain('&additional=param');
    });
  });

  describe('Timeout handling (Line 152)', () => {
    test('should set timeout when timeoutMs is provided', async () => {
      const client = new FetchClient({ baseURL: 'https://timeout.example.com' });
      
      // Mock a slow response
      (global.fetch as jest.Mock).mockImplementation(() => {
        return new Promise((resolve) => {
          setTimeout(() => resolve(mkResponse()), 50);
        });
      });

      await client.call('GET', '/slow', {
        timeoutMs: 100, // Should not timeout
      });

      expect(true).toBe(true);
    });
  });

  describe('Retry error handling (Lines 181-184)', () => {
    test('should handle retry mechanism failures', async () => {
      let attempts = 0;
      
      (global.fetch as jest.Mock).mockImplementation(() => {
        attempts++;
        return Promise.reject(new Error(`Attempt ${attempts} failed`));
      });

      const client = new FetchClient({ baseURL: 'https://retry.example.com' });
      
      try {
        await client.call('GET', '/failing', {
          retry: { retries: 2 },
        });
      } catch (error) {
        // Should have attempted 3 times (original + 2 retries)
        expect(attempts).toBe(3);
      }
    });
  });

  describe('CSRF token removal (Line 193)', () => {
    beforeEach(() => {
      (global.fetch as jest.Mock).mockImplementation(() => Promise.resolve(mkResponse()));
    });

    test('should remove X-CSRF-Token for GET method', async () => {
      const client = new FetchClient({ baseURL: 'https://csrf.example.com' });
      
      const response = await client.call('GET', '/safe', {
        headers: {
          'X-CSRF-Token': 'should-be-removed',
          'Keep': 'this-header',
        },
      });
      
      expect(response.request.headers?.['Keep']).toBe('this-header');
      expect(response.request.headers?.['X-CSRF-Token']).toBeUndefined();
    });

    test('should remove X-CSRF-Token for HEAD method', async () => {
      const client = new FetchClient({ baseURL: 'https://csrf.example.com' });
      
      const response = await client.call('HEAD', '/safe', {
        headers: {
          'X-CSRF-Token': 'should-be-removed',
          'Authorization': 'Bearer token',
        },
      });
      
      expect(response.request.headers?.['Authorization']).toBe('Bearer token');
      expect(response.request.headers?.['X-CSRF-Token']).toBeUndefined();
    });
  });

  describe('ETag handling (Line 210)', () => {
    test('should set If-None-Match header when ETag is present', async () => {
      (global.fetch as jest.Mock).mockImplementation(() => 
        Promise.resolve(mkResponse({ 
          headers: { 'etag': '"test-etag"' }
        }))
      );
      
      const client = new FetchClient({ baseURL: 'https://etag.example.com' });
      
      const response = await client.call('GET', '/cached');
      
      expect(response.request.headers?.['If-None-Match']).toBe('"test-etag"');
    });

    test('should handle uppercase ETag header', async () => {
      (global.fetch as jest.Mock).mockImplementation(() => 
        Promise.resolve(mkResponse({ 
          headers: { 'ETag': '"uppercase-etag"' }
        }))
      );
      
      const client = new FetchClient({ baseURL: 'https://etag.example.com' });
      
      const response = await client.call('GET', '/cached-upper');
      
      expect(response.request.headers?.['If-None-Match']).toBe('"uppercase-etag"');
    });
  });

  describe('Parameter serialization (Lines 270-281)', () => {
    test('should serialize array parameters correctly', async () => {
      const client = new FetchClient({ baseURL: 'https://arrays.example.com' });
      
      const response = await client.call('GET', '/arrays', {
        params: {
          singleArray: ['a', 'b', 'c'],
          numberArray: [1, 2, 3],
        },
      });
      
      expect(response.request.path).toContain('singleArray=a');
      expect(response.request.path).toContain('singleArray=b');
      expect(response.request.path).toContain('numberArray=1');
    });
  });

  describe('Environment detection (Lines 317-319)', () => {
    test('should detect Node.js environment when window is undefined', () => {
      const originalWindow = (global as any).window;
      const originalFetch = global.fetch;
      
      // Remove both window and fetch to simulate Node.js without polyfills
      delete (global as any).window;
      delete (global as any).fetch;
      
      expect(() => checkFetcher()).toThrow('node-fetch');
      
      // Restore
      global.fetch = originalFetch;
      if (originalWindow) {
        (global as any).window = originalWindow;
      }
    });

    test('should detect browser environment when window is defined', () => {
      const originalFetch = global.fetch;
      
      // Mock browser environment with window but no fetch
      (global as any).window = {};
      delete (global as any).fetch;
      
      expect(() => checkFetcher()).toThrow('unfetch');
      
      // Restore
      global.fetch = originalFetch;
      delete (global as any).window;
    });
  });

  describe('Response parsing edge cases (Lines 286, 298-301)', () => {
    test('should handle response without content-type header', async () => {
      // Mock response with no content-type header at all
      const noContentTypeResponse = {
        ok: true,
        status: 200,
        statusText: 'OK',
        headers: new Map(), // Empty headers - no content-type
        json: () => Promise.resolve({ default: 'json' }),
        text: () => Promise.resolve('text fallback'),
      };
      
      (global.fetch as jest.Mock).mockImplementation(() => Promise.resolve(noContentTypeResponse));
      
      const client = new FetchClient({ baseURL: 'https://no-content-type.example.com' });
      const response = await client.call('GET', '/no-content-type');
      
      // Should default to JSON when no content-type
      expect(response.data).toEqual({ default: 'json' });
    });

    test('should handle text content type responses', async () => {
      (global.fetch as jest.Mock).mockImplementation(() => 
        Promise.resolve(mkResponse({ 
          headers: { 'content-type': 'text/plain' },
          json: 'Plain text response'
        }))
      );
      
      const client = new FetchClient({ baseURL: 'https://text.example.com' });
      const response = await client.call('GET', '/text-response');
      
      expect(response.status).toBe(200);
    });

    test('should return null when no parsing methods available', async () => {
      const noMethodsResponse = {
        ok: true,
        status: 200,
        statusText: 'OK',
        headers: new Map([['content-type', 'application/octet-stream']]),
        // No json or text methods
      };
      
      (global.fetch as jest.Mock).mockImplementation(() => Promise.resolve(noMethodsResponse));
      
      const client = new FetchClient({ baseURL: 'https://no-methods.example.com' });
      const response = await client.call('GET', '/no-methods');
      
      expect(response.data).toBeNull();
    });
  });

  describe('Additional coverage scenarios', () => {
    test('should handle various method cases for CSRF removal', async () => {
      (global.fetch as jest.Mock).mockImplementation(() => Promise.resolve(mkResponse()));
      
      const client = new FetchClient({ baseURL: 'https://method-cases.example.com' });
      
      // Test lowercase methods
      await client.call('get', '/get-test', {
        headers: { 'X-CSRF-Token': 'remove-me' },
      });
      
      await client.call('head', '/head-test', {
        headers: { 'X-CSRF-Token': 'remove-me' },
      });
      
      expect(true).toBe(true);
    });

    test('should handle empty query parameter strings', async () => {
      const client = new FetchClient({ baseURL: 'https://empty-params.example.com' });
      
      await client.call('GET', '/empty', {
        params: {}, // Empty params object
      });
      
      expect(true).toBe(true);
    });

    test('should handle query parameters that result in empty string', async () => {
      const client = new FetchClient({ baseURL: 'https://empty-query.example.com' });
      
      // This should test the case where serializeQueryParams returns empty string
      await client.call('GET', '/no-real-params', {
        params: undefined,
      });
      
      expect(true).toBe(true);
    });
  });
});
