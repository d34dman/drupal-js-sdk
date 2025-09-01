import {Drupal} from '@drupal-js-sdk/core';
import {DrupalMenu} from '../DrupalMenu';
import {AxiosClient} from '@drupal-js-sdk/xhr';
import { XhrRequestConfig, XhrResponse } from '@drupal-js-sdk/interfaces';

// Minimal axios-like stub compatible with AxiosClient
const createStubClient = () => ({
  request: <T = unknown, D = unknown>(config: XhrRequestConfig<D>): Promise<XhrResponse<T, D>> => {
    const url = config.url ?? '';
    if (url === '/system/menu/main/linkset') {
      const res: XhrResponse<unknown, D> = {
        data: 'Mock 200',
        status: 200,
        statusText: 'OK',
        headers: {},
        config,
        request: {},
      };
      return Promise.resolve(res as XhrResponse<T, D>);
    }
    const res: XhrResponse<unknown, D> = {
      data: null,
      status: 200,
      statusText: 'OK',
      headers: {},
      config,
      request: {},
    };
    return Promise.resolve(res as XhrResponse<T, D>);
  },
});

const mockData: {[key: string]: any;} = {
  invalid: {},
  validTree: [
    {
      id: 'main.000',
      parentId: '0',
      name: 'Home',
      href: '/',
      level: 1,
      items: [],
    },
    {
      id: 'main.001',
      parentId: '0',
      name: 'About',
      href: '/about-us',
      level: 1,
      items: [],
    },
    {
      id: 'main.002',
      parentId: '0',
      name: 'Foo',
      href: '',
      level: 1,
      items: [
        {
          id: 'main.002.000',
          parentId: 'main.002',
          name: 'Bar',
          href: '',
          level: 2,
          items: [],
        },
        {
          id: 'main.002.001',
          parentId: 'main.002',
          name: 'Baz',
          href: '',
          level: 2,
          items: [],
        },
      ],
    },
  ],
  valid: {
    linkset: [
      {
        anchor: '/system/menu/main/linkset',
        item: [
          {
            href: '/',
            title: 'Home',
            'drupal-menu-hierarchy': ['.000'],
            'drupal-menu-machine-name': ['main'],
          },
          {
            href: '/about-us',
            title: 'About',
            'drupal-menu-hierarchy': ['.001'],
            'drupal-menu-machine-name': ['main'],
          },
          {
            href: '',
            title: 'Foo',
            'drupal-menu-hierarchy': ['.002'],
            'drupal-menu-machine-name': ['main'],
          },
          {
            href: '',
            title: 'Bar',
            'drupal-menu-hierarchy': ['.002.000'],
            'drupal-menu-machine-name': ['main'],
          },
          {
            href: '',
            title: 'Baz',
            'drupal-menu-hierarchy': ['.002.001'],
            'drupal-menu-machine-name': ['main'],
          },
        ],
      },
    ],
  },
};

test('Drupal Menu : getMenu', async () => {
  const config = {
    baseURL: 'http://www.example.com',
  };
  const sdk = new Drupal(config);
  const menu = new DrupalMenu(sdk);

  let spy = jest.spyOn(menu, 'getMenuRaw').mockImplementation(
    (): Promise<any> => Promise.resolve({data: mockData.valid}),
  );

  expect(menu.getMenu('main')).toBeInstanceOf(Promise);

  await menu.getMenu('main').then((data) => {
    expect(data).toStrictEqual(mockData.validTree);
  });

  spy = jest.spyOn(menu, 'getMenuRaw').mockImplementation(
    (): Promise<any> => Promise.resolve({data: mockData.invalid}),
  );
  expect(menu.getMenu('main')).rejects.toThrow('Menu data is invalid');
  await menu.getMenu('main')
    .catch((error) => {
      expect(error.toString()).toBe('DrupalError: 107 Menu data is invalid');
    });
  spy.mockRestore();
});

test('Drupal Menu : massage Menu', () => {
  const config = {
    baseURL: 'http://www.example.com',
  };
  const sdk = new Drupal(config);
  const menu = new DrupalMenu(sdk);
  const menuData = mockData.valid;
  expect(menu.checkIfDrupalMenuDataIsValid(menuData)).toBe(true);
  const normalizedItems = menu.normalizeListItems(menuData);
  const treeData = menu.convertFlatListItemsToTree(normalizedItems);
  expect(treeData.length).toBe(3);
});

test('Drupal Menu function defaults', () => {
  const config = {
    baseURL: 'http://www.example.com',
  };
  const sdk = new Drupal(config);
  const menu = new DrupalMenu(sdk);
  expect(menu.checkIfDrupalMenuDataIsValid(mockData.invalid)).toBe(false);
  expect(menu.convertFlatListItemsToTree([])).toEqual([]);
  expect(menu.normalizeListItems({})).toEqual([]);
});

test('Drupal Menu axios request', async () => {
  const client = new AxiosClient(createStubClient());
  const config = {
    baseURL: 'http://www.example.com',
  };
  const sdk = new Drupal(config);
  sdk.setClientService(client);
  const menu = new DrupalMenu(sdk);
  expect.assertions(1);
  await menu.getMenuRaw('main')
    .then((response) => {
      expect(response.data).toBe('Mock 200');
    });
});

test('Drupal Menu list alias method (Line 51)', async () => {
  const config = {
    baseURL: 'http://www.example.com',
  };
  const sdk = new Drupal(config);
  const menu = new DrupalMenu(sdk);

  let spy = jest.spyOn(menu, 'getMenuRaw').mockImplementation(
    (): Promise<any> => Promise.resolve({data: mockData.valid}),
  );

  // This should cover Line 51: return this.getMenu(menuName)
  const result = await menu.list('main');
  
  expect(result).toStrictEqual(mockData.validTree);
  spy.mockRestore();
});

test('Drupal Menu raw alias method (Line 69)', async () => {
  const client = new AxiosClient(createStubClient());
  const config = {
    baseURL: 'http://www.example.com',
  };
  const sdk = new Drupal(config);
  sdk.setClientService(client);
  const menu = new DrupalMenu(sdk);
  
  // This should cover Line 69: return this.getMenuRaw(menuName)
  const response = await menu.raw('main');
  
  expect(response.data).toBe('Mock 200');
});

test('Drupal Menu branch coverage for legacy vs current keys (Lines 89-90)', () => {
  const config = {
    baseURL: 'http://www.example.com',
  };
  const sdk = new Drupal(config);
  const menu = new DrupalMenu(sdk);

  // Test data with legacy keys (machine-name, hierarchy)
  const legacyMenuData = {
    linkset: [
      {
        anchor: '/system/menu/main/linkset',
        item: [
          {
            href: '/',
            title: 'Home Legacy',
            'machine-name': ['main'], // Legacy key
            'hierarchy': ['.000'],     // Legacy key
          },
          {
            href: '/about',
            title: 'About Legacy', 
            'machine-name': ['main'],
            'hierarchy': ['.001'],
          },
        ],
      },
    ],
  };

  // Test data with current keys (drupal-menu-machine-name, drupal-menu-hierarchy)
  const currentMenuData = {
    linkset: [
      {
        anchor: '/system/menu/main/linkset',
        item: [
          {
            href: '/',
            title: 'Home Current',
            'drupal-menu-machine-name': ['main'], // Current key
            'drupal-menu-hierarchy': ['.000'],    // Current key
          },
          {
            href: '/about',
            title: 'About Current',
            'drupal-menu-machine-name': ['main'],
            'drupal-menu-hierarchy': ['.001'],
          },
        ],
      },
    ],
  };

  // Test data with mixed keys (some legacy, some current)
  const mixedMenuData = {
    linkset: [
      {
        anchor: '/system/menu/main/linkset',
        item: [
          {
            href: '/',
            title: 'Home Mixed',
            'machine-name': ['main'],              // Legacy
            'drupal-menu-hierarchy': ['.000'],     // Current
          },
          {
            href: '/about',
            title: 'About Mixed',
            'drupal-menu-machine-name': ['main'],  // Current
            'hierarchy': ['.001'],                 // Legacy
          },
        ],
      },
    ],
  };

  // Test data with missing keys (should use empty string fallbacks)
  const missingKeysMenuData = {
    linkset: [
      {
        anchor: '/system/menu/main/linkset',
        item: [
          {
            href: '/',
            // Missing title - should use empty string
            // Missing machine-name and drupal-menu-machine-name - should use empty string
            // Missing hierarchy and drupal-menu-hierarchy - should use empty string
          },
          {
            // Missing href - should use empty string
            title: 'Title Only',
            'drupal-menu-machine-name': ['main'],
            'drupal-menu-hierarchy': ['.001'],
          },
        ],
      },
    ],
  };

  // Test all the different branches
  expect(menu.checkIfDrupalMenuDataIsValid(legacyMenuData)).toBe(true);
  expect(menu.checkIfDrupalMenuDataIsValid(currentMenuData)).toBe(true);
  expect(menu.checkIfDrupalMenuDataIsValid(mixedMenuData)).toBe(true);
  expect(menu.checkIfDrupalMenuDataIsValid(missingKeysMenuData)).toBe(true);

  // Test normalization with different key combinations
  const legacyNormalized = menu.normalizeListItems(legacyMenuData);
  const currentNormalized = menu.normalizeListItems(currentMenuData);
  const mixedNormalized = menu.normalizeListItems(mixedMenuData);
  const missingNormalized = menu.normalizeListItems(missingKeysMenuData);

  expect(legacyNormalized.length).toBeGreaterThan(0);
  expect(currentNormalized.length).toBeGreaterThan(0);
  expect(mixedNormalized.length).toBeGreaterThan(0);
  expect(missingNormalized.length).toBeGreaterThan(0);

  // Test tree conversion
  const legacyTree = menu.convertFlatListItemsToTree(legacyNormalized);
  const currentTree = menu.convertFlatListItemsToTree(currentNormalized);
  
  expect(legacyTree.length).toBe(2);
  expect(currentTree.length).toBe(2);
});

test('Drupal Menu edge cases for complete branch coverage', () => {
  const config = {
    baseURL: 'http://www.example.com',
  };
  const sdk = new Drupal(config);
  const menu = new DrupalMenu(sdk);

  // Test with items that have null/undefined values for all nullable fields
  const nullValueMenuData = {
    linkset: [
      {
        anchor: '/system/menu/main/linkset',
        item: [
          {
            href: null,        // null href - should become ""
            title: undefined,  // undefined title - should become ""
            'drupal-menu-machine-name': null,  // null - should use fallback ?? ""
            'drupal-menu-hierarchy': undefined, // undefined - should use fallback ?? ""
          },
          {
            href: '',          // empty string href
            title: '',         // empty string title
            'machine-name': [], // empty array - should use ?? ""
            'hierarchy': [],    // empty array - should use ?? ""
          },
        ],
      },
    ],
  };

  expect(menu.checkIfDrupalMenuDataIsValid(nullValueMenuData)).toBe(true);
  
  const nullNormalized = menu.normalizeListItems(nullValueMenuData);
  expect(nullNormalized.length).toBe(2);
  
  // All should have empty strings due to nullish coalescing
  nullNormalized.forEach(item => {
    expect(typeof item.href).toBe('string');
    expect(typeof item.name).toBe('string'); // MenuItem has 'name' not 'title'
  });
});
