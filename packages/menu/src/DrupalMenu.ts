import { CoreInterface, XhrInterface, XhrResponse } from "@drupal-js-sdk/interfaces";
import { DrupalError } from "@drupal-js-sdk/error";

interface MenuDictionary<TValue> {
  [id: string]: TValue;
}

/**
 * Constructs a new Drupal.Menu object with the given code and message.
 */
export interface MenuItem {
  id: string;
  parentId: string;
  name: string;
  href: string;
  level: number;
  items: MenuItem[] | null;
}

/** Linkset item shape as returned by Drupal Decoupled Menus. Supports legacy and current keys. */
interface MenuLinksetItem {
  href: string;
  title: string;
  // Current keys used by Decoupled Menus
  "drupal-menu-hierarchy"?: string[];
  "drupal-menu-machine-name"?: string[];
  // Legacy or alternate keys sometimes seen in examples
  hierarchy?: string[];
  "machine-name"?: string[];
}

/** Linkset envelope returned by Drupal. */
interface MenuLinkset {
  linkset: Array<{
    anchor: string;
    item: MenuLinksetItem[];
  }>;
}

export class DrupalMenu {
  drupal: CoreInterface;
  client: XhrInterface;
  constructor(drupal: CoreInterface) {
    this.drupal = drupal;
    this.client = drupal.getClientService();
  }

  /** Alias: list the menu as a normalized tree. */
  public async list(menuName: string): Promise<MenuItem[]> {
    return this.getMenu(menuName);
  }

  public async getMenu(menuName: string): Promise<MenuItem[]> {
    return this.getMenuRaw(menuName).then((res) => {
      const data = res.data;
      if (this.checkIfDrupalMenuDataIsValid(data)) {
        const normalizedItems = this.normalizeListItems(data);
        return this.convertFlatListItemsToTree(normalizedItems);
      } else {
        throw new DrupalError(DrupalError.INVALID_JSON, "Menu data is invalid");
      }
    });
  }

  /** Alias: get raw linkset response. */
  public raw(menuName: string): Promise<XhrResponse<MenuLinkset, unknown>> {
    return this.getMenuRaw(menuName);
  }

  public getMenuRaw(menuName: string): Promise<XhrResponse<MenuLinkset, unknown>> {
    return this.client.call("get", `/system/menu/${menuName}/linkset`) as Promise<
      XhrResponse<MenuLinkset, unknown>
    >;
  }

  /**
   * Normalize Drupal array.
   * So that we can feed it into an algorithm that was copy-pasted from stack overflow.
   */
  public normalizeListItems(data: unknown): MenuItem[] {
    const list: MenuItem[] = [];
    if (this.checkIfDrupalMenuDataIsValid(data)) {
      const typed = data as MenuLinkset;
      const items: MenuLinksetItem[] = typed.linkset[0].item;
      items.forEach((item: MenuLinksetItem) => {
        let parentId: string;
        let level: number;
        // Support legacy and current keys
        const machineName = (item["drupal-menu-machine-name"] ?? item["machine-name"])?.[0] ?? "";
        const hierarchy = (item["drupal-menu-hierarchy"] ?? item["hierarchy"])?.[0] ?? "";
        const id = `${machineName}${hierarchy}`;
        const idArray = id.split(".");
        idArray.pop();
        parentId = idArray.join(".");
        level = 0;
        level = idArray.length;
        if (level < 2) {
          parentId = "0";
        }
        const node: MenuItem = {
          id,
          parentId,
          name: String(item.title ?? ""),
          href: String(item.href ?? ""),
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
  public checkIfDrupalMenuDataIsValid(data: unknown): data is MenuLinkset {
    const d = data as { linkset?: Array<{ item?: unknown[] }> } | undefined;
    return Boolean(
      d && Array.isArray(d.linkset) && d.linkset[0] && Array.isArray(d.linkset[0].item)
    );
  }

  /**
   * Convert Flat list to Tre structure.
   */
  public convertFlatListItemsToTree(inputList: MenuItem[]): MenuItem[] {
    const roots: MenuItem[] = [];
    if (inputList.length === 0) {
      return roots;
    }
    const myObjMap: MenuDictionary<number> = {};
    inputList.forEach((node, index) => {
      myObjMap[node.id] = index;
      inputList[index].items = [] as MenuItem[];
    });
    inputList.forEach((node) => {
      if (node.parentId === "0") {
        roots.push(node);
      } else {
        inputList[myObjMap[node.parentId]].items!.push(node);
      }
    });
    return roots;
  }
}
