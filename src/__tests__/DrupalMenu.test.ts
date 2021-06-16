import {AxiosApiClient} from '../AxiosApiClient';
import {Drupal} from '../Drupal';
import {DrupalMenu} from '../DrupalMenu';

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
  const drupal = new Drupal().initialize({baseURL: 'https://example.com'});
  const axiosClient = new AxiosApiClient();
  drupal.core.setApiClientService(axiosClient);
  const menu = new DrupalMenu(drupal);

  expect(menu.getMenu('main')).toBeInstanceOf(Promise);

  let spy = jest.spyOn(menu, 'getMenuRaw').mockImplementation(
    (): Promise<any> => Promise.resolve({data: mockData.valid}),
  );

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
  const drupal = new Drupal().initialize({baseURL: 'https://example.com'});
  const menu = new DrupalMenu(drupal);
  const menuData = mockData.valid;
  expect(menu.checkIfDrupalMenuDataIsValid(menuData)).toBe(true);
  const normalizedItems = menu.normalizeListItems(menuData);
  const treeData = menu.convertFlatListItemsToTree(normalizedItems);
  expect(treeData.length).toBe(3);
});

test('Drupal Menu function defaults', () => {
  const drupal = new Drupal().initialize({baseURL: 'https://example.com'});
  const menu = new DrupalMenu(drupal);
  expect(menu.checkIfDrupalMenuDataIsValid(mockData.invalid)).toBe(false);
  expect(menu.convertFlatListItemsToTree([])).toEqual([]);
  expect(menu.normalizeListItems({})).toEqual([]);
});
