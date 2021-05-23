import {Drupal} from '../Drupal';
import {DrupalMenu} from '../DrupalMenu';

const mockData: {[key: string]: any;} = {
  invalid: {},
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

test('Drupal Menu : getMenu', () => {
  const drupal = new Drupal().initialize({baseURL: 'https://example.com'});
  const menu = new DrupalMenu(drupal);
  expect.assertions(2);
  expect(menu.getMenu('main')).toBeInstanceOf(Promise);
  return menu.getMenu('main').then(data => {
    expect(data).toBeInstanceOf(Array);
  });
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
