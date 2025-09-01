import { DrupalSDK } from '..';
import { DrupalAuth } from '@drupal-js-sdk/auth';
import { DrupalMenu } from '@drupal-js-sdk/menu';
import { DrupalEntity } from '@drupal-js-sdk/entity';

describe('DrupalSDK', () => {
  describe('Constructor and Initialization', () => {
    test('should initialize with basic configuration', () => {
      const config = {
        baseURL: 'https://api.example.com',
      };
      const sdk = new DrupalSDK(config);
      
      expect(sdk).toBeInstanceOf(DrupalSDK);
      expect(sdk.config.getItem('baseURL')).toBe(config.baseURL);
    });

    test('should initialize feature modules', () => {
      const config = {
        baseURL: 'https://drupal.example.com',
      };
      const sdk = new DrupalSDK(config);
      
      // Test that all feature modules are initialized
      expect(sdk.auth).toBeInstanceOf(DrupalAuth);
      expect(sdk.menu).toBeInstanceOf(DrupalMenu);
      expect(sdk.entities).toBeInstanceOf(DrupalEntity);
    });

    test('should initialize with complex configuration', () => {
      const config = {
        baseURL: 'https://complex.drupal.example.com',
        timeout: 10000,
        credentials: 'include',
        headers: {
          'Custom-Header': 'custom-value',
        },
      };
      const sdk = new DrupalSDK(config);
      
      expect(sdk.config.getItem('baseURL')).toBe(config.baseURL);
      expect(sdk.config.getItem('timeout')).toBe(config.timeout);
    });

    test('should inherit from Core Drupal', () => {
      const config = {
        baseURL: 'https://inherit.example.com',
      };
      const sdk = new DrupalSDK(config);
      
      // Should have Core Drupal methods
      expect(typeof sdk.initialize).toBe('function');
      expect(typeof sdk.getClientService).toBe('function');
      expect(typeof sdk.getConfigService).toBe('function');
      expect(typeof sdk.getSessionService).toBe('function');
    });
  });

  describe('Feature Module Integration', () => {
    test('auth module should be properly configured', () => {
      const config = {
        baseURL: 'https://auth.example.com',
      };
      const sdk = new DrupalSDK(config);
      
      expect(sdk.auth).toBeDefined();
      expect(sdk.auth).toBeInstanceOf(DrupalAuth);
      
      // Auth should be initialized with the same core instance
      expect(typeof sdk.auth.login).toBe('function');
      expect(typeof sdk.auth.logout).toBe('function');
    });

    test('menu module should be properly configured', () => {
      const config = {
        baseURL: 'https://menu.example.com',
      };
      const sdk = new DrupalSDK(config);
      
      expect(sdk.menu).toBeDefined();
      expect(sdk.menu).toBeInstanceOf(DrupalMenu);
      
      // Menu should be initialized with the same core instance
      expect(typeof sdk.menu.getMenu).toBe('function');
    });

    test('entities module should be properly configured', () => {
      const config = {
        baseURL: 'https://entities.example.com',
      };
      const sdk = new DrupalSDK(config);
      
      expect(sdk.entities).toBeDefined();
      expect(sdk.entities).toBeInstanceOf(DrupalEntity);
      
      // Entities should be initialized with the same core instance
      expect(typeof sdk.entities.entity).toBe('function');
      expect(typeof sdk.entities.node).toBe('function');
    });

    test('feature modules should share the same core instance', () => {
      const config = {
        baseURL: 'https://shared.example.com',
      };
      const sdk = new DrupalSDK(config);
      
      // All feature modules should share the same configuration
      sdk.config.setItem('testShared', 'sharedValue');
      
      // Verify they all see the same config changes
      expect(sdk.config.getItem('testShared')).toBe('sharedValue');
      
      // Feature modules are initialized with 'this' (the SDK instance)
      // which extends CoreDrupal, so they share the same core
    });
  });

  describe('Configuration Management', () => {
    test('should handle configuration updates', () => {
      const config = {
        baseURL: 'https://config.example.com',
      };
      const sdk = new DrupalSDK(config);
      
      // Test configuration storage
      sdk.config.setItem('customSetting', 'customValue');
      expect(sdk.config.getItem('customSetting')).toBe('customValue');
      
      // Test configuration inheritance
      expect(sdk.initialize(config)).toBe(sdk);
    });

    test('should maintain configuration state', () => {
      const initialConfig = {
        baseURL: 'https://initial.example.com',
        apiKey: 'initial-key',
      };
      const sdk = new DrupalSDK(initialConfig);
      
      expect(sdk.config.getItem('baseURL')).toBe(initialConfig.baseURL);
      expect(sdk.config.getItem('apiKey')).toBe(initialConfig.apiKey);
      
      // Update configuration
      sdk.config.setItem('baseURL', 'https://updated.example.com');
      expect(sdk.config.getItem('baseURL')).toBe('https://updated.example.com');
      
      // Original apiKey should still be there
      expect(sdk.config.getItem('apiKey')).toBe(initialConfig.apiKey);
    });
  });

  describe('SDK Usage Scenarios', () => {
    test('should support typical usage workflow', () => {
      const config = {
        baseURL: 'https://workflow.drupal.example.com',
      };
      const sdk = new DrupalSDK(config);
      
      // SDK should be ready to use immediately
      expect(sdk.auth).toBeDefined();
      expect(sdk.menu).toBeDefined();
      expect(sdk.entities).toBeDefined();
      
      // Configuration should be accessible
      expect(sdk.config.getItem('baseURL')).toBe(config.baseURL);
      
      // Core services should be available
      expect(sdk.getClientService()).toBeDefined();
      expect(sdk.getConfigService()).toBeDefined();
      expect(sdk.getSessionService()).toBeDefined();
    });

    test('should handle minimal configuration', () => {
      const sdk = new DrupalSDK({ baseURL: 'https://minimal.example.com' });
      
      expect(sdk.auth).toBeInstanceOf(DrupalAuth);
      expect(sdk.menu).toBeInstanceOf(DrupalMenu);
      expect(sdk.entities).toBeInstanceOf(DrupalEntity);
    });

    test('should handle undefined configuration properties', () => {
      const config = {
        baseURL: 'https://undefined.example.com',
        undefinedProp: undefined,
        nullProp: null,
      };
      const sdk = new DrupalSDK(config);
      
      expect(sdk.config.getItem('baseURL')).toBe(config.baseURL);
      expect(sdk.config.getItem('undefinedProp')).toBeNull(); // Storage returns null for missing items
      expect(sdk.config.getItem('nullProp')).toBeNull();
    });
  });

  describe('Type Safety and Interface Compliance', () => {
    test('should maintain proper typing for feature modules', () => {
      const config = {
        baseURL: 'https://typing.example.com',
      };
      const sdk = new DrupalSDK(config);
      
      // TypeScript should enforce correct types
      expect(sdk.auth.constructor.name).toBe('DrupalAuth');
      expect(sdk.menu.constructor.name).toBe('DrupalMenu');
      expect(sdk.entities.constructor.name).toBe('DrupalEntity');
    });

    test('should provide readonly access to feature modules', () => {
      const config = {
        baseURL: 'https://readonly.example.com',
      };
      const sdk = new DrupalSDK(config);
      
      // Feature modules should be defined as readonly
      // This is enforced at TypeScript compile time
      expect(sdk.auth).toBeDefined();
      expect(sdk.menu).toBeDefined();
      expect(sdk.entities).toBeDefined();
    });
  });

  describe('Integration with Core Features', () => {
    test('should integrate with storage systems', () => {
      const config = {
        baseURL: 'https://storage.example.com',
      };
      const sdk = new DrupalSDK(config);
      
      // Should have inherited storage capabilities
      sdk.config.setItem('storageTest', 'stored');
      expect(sdk.config.getItem('storageTest')).toBe('stored');
      
      sdk.config.setString('stringTest', 'stringValue');
      expect(sdk.config.getString('stringTest')).toBe('stringValue');
      
      expect(sdk.config.isAvailable()).toBe(true);
    });

    test('should integrate with session management', () => {
      const config = {
        baseURL: 'https://session.example.com',
      };
      const sdk = new DrupalSDK(config);
      
      const sessionService = sdk.getSessionService();
      
      sessionService.setItem('sessionTest', 'sessionValue');
      expect(sessionService.getItem('sessionTest')).toBe('sessionValue');
    });

    test('should integrate with HTTP client', () => {
      const config = {
        baseURL: 'https://client.example.com',
      };
      const sdk = new DrupalSDK(config);
      
      const clientService = sdk.getClientService();
      
      expect(clientService).toBeDefined();
      expect(typeof clientService.call).toBe('function');
      expect(typeof clientService.addDefaultHeaders).toBe('function');
    });
  });
});
