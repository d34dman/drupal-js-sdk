import {Drupal, DrupalMenu} from '..';
import axios from 'axios';
import MockAdapter from 'axios-mock-adapter';
import {AxiosClient} from '@drupal-js-sdk/xhr';

const mock = new MockAdapter(axios);

mock.onGet('/system/menu/main/linkset').reply(200, 'Mock 200');

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
  const axiosClient = axios.create();
  const client = new AxiosClient(axiosClient);
  client.setClient(axios.create());
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
