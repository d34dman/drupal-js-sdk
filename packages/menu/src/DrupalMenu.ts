import {CoreInterface, XhrInterface} from '@drupal-js-sdk/interfaces';
import {DrupalError} from '@drupal-js-sdk/error';


interface MenuDictionary<TValue> {
  [id: string]: TValue;
}

/**
 * Constructs a new Drupal.Menu object with the given code and message.
 */
export class DrupalMenu {
  drupal: CoreInterface;
  client: XhrInterface;
  constructor(drupal: CoreInterface) {
    this.drupal = drupal;
    this.client = drupal.getClientService();
  }

  public async getMenu(menuName: string): Promise<any> {
    return this.getMenuRaw(menuName)
      .then((res) => {
        const data = res.data;
        if (this.checkIfDrupalMenuDataIsValid(data)) {
          const normalizedItems = this.normalizeListItems(data);
          return this.convertFlatListItemsToTree(normalizedItems);
        } else {
          throw new DrupalError(DrupalError.INVALID_JSON, 'Menu data is invalid');
        }
      });
  }

  public getMenuRaw(menuName: string): Promise<any> {
    return this.client.call('get', `/system/menu/${menuName}/linkset`);
  }

  /**
   * Normalize Drupal array.
   * So that we can feed it into an algorithm that was copy-pasted from stack overflow.
   */
  public normalizeListItems(data: {[key: string]: any;}): any[] {
    const list: {[key: string]: any;}[] = [];
    if (this.checkIfDrupalMenuDataIsValid(data)) {
      const items = data.linkset[0].item;
      items.map((item: {[key: string]: any;}) => {
        let parentId;
        let level;
        const id = `${item['drupal-menu-machine-name'][0]}${item['drupal-menu-hierarchy'][0]}`;
        const idArray = id.split('.');
        idArray.pop();
        parentId = idArray.join('.');
        level = 0;
        level = idArray.length;
        if (level < 2) {
          parentId = '0';
        }
        const node = {
          id,
          parentId,
          name: item.title,
          href: item.href,
          level,
          items: null,
        };
        list.push(node);
      });
    }
    return list;
  }

  /**
   * Check if menu data is valid.
   */
  public checkIfDrupalMenuDataIsValid(
    data: {[key: string]: any;} | undefined,
  ): boolean {
    if (
      data !== undefined &&
      data.linkset !== undefined &&
      data.linkset[0] !== undefined &&
      data.linkset[0].item !== undefined
    ) {
      return true;
    } else {
      return false;
    }
  }

  /**
   * Convert Flat list to Tre structure.
   */
  public convertFlatListItemsToTree(inputList: any[]): any[] {
    const roots: {[key: string]: any;}[] = [];
    if (inputList.length === 0) {
      return roots;
    }
    const myObjMap: MenuDictionary<any> = {};
    inputList.map((node, index) => {
      myObjMap[node.id] = index;
      inputList[index].items = [];
    });
    inputList.map((node) => {
      if (node.parentId === '0') {
        roots.push(node);
      } else {
        inputList[myObjMap[node.parentId]].items.push(node);
      }
    });
    return roots;
  }
}
