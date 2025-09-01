import {
  EntityIdentifier,
  EntityAttributes,
  EntityRecord,
  EntityListOptions,
  EntityLoadOptions,
} from "@drupal-js-sdk/interfaces";

import { EntityService } from "./EntityService";

type SortDirection = "ASC" | "DESC";

type FilterValue = string | number | boolean | Array<string | number | boolean>;

interface PageOptions {
  limit?: number;
  offset?: number;
  number?: number;
}

/** Simple JSON:API query object builder (plain object, not string). */
class JsonApiQueryBuilder {
  private readonly includePaths: string[] = [];
  private fieldsByType: Record<string, string[]> = {};
  private readonly sorts: Array<{ field: string; dir: SortDirection }> = [];
  private pageObj: PageOptions = {};
  private readonly filters: Array<{ field: string; operator?: string; value: FilterValue }> = [];

  public include(paths: string[]): this {
    this.includePaths.push(...paths);
    return this;
  }
  public select(type: string, fields: string[]): this {
    this.fieldsByType[type] = fields;
    return this;
  }
  public sort(field: string, dir: SortDirection): this {
    this.sorts.push({ field, dir });
    return this;
  }
  public page(opts: PageOptions): this {
    this.pageObj = { ...this.pageObj, ...opts };
    return this;
  }
  public where(field: string, value: FilterValue, operator?: string): this {
    this.filters.push({ field, value, operator });
    return this;
  }

  public toObject(): Record<string, unknown> {
    const out: Record<string, unknown> = {};
    if (this.includePaths.length) out.include = this.includePaths.join(",");
    const fields: Record<string, string> = {};
    // eslint-disable-next-line @typescript-eslint/no-unsafe-call
    const fieldEntries = Object.entries(this.fieldsByType) as Array<[string, string[]]>;
    let entryIndex = 0;
    // eslint-disable-next-line no-loops/no-loops
    while (entryIndex < fieldEntries.length) {
      const [type, list] = fieldEntries[entryIndex];
      fields[`fields[${type}]`] = list.join(",");
      entryIndex += 1;
    }
    Object.assign(out, fields);
    if (this.sorts.length) {
      out.sort = this.sorts.map((s) => (s.dir === "DESC" ? `-${s.field}` : s.field)).join(",");
    }
    const page: Record<string, number> = {};
    if (typeof this.pageObj.limit === "number") page["page[limit]"] = this.pageObj.limit;
    if (typeof this.pageObj.offset === "number") page["page[offset]"] = this.pageObj.offset;
    if (typeof this.pageObj.number === "number") page["page[number]"] = this.pageObj.number;
    Object.assign(out, page);

    this.filters.forEach((f, idx) => {
      const key = `filter[${idx}][condition]`;
      out[`${key}[path]`] = f.field;
      // eslint-disable-next-line @typescript-eslint/strict-boolean-expressions
      if (f.operator) out[`${key}[operator]`] = f.operator;
      out[`${key}[value]`] = Array.isArray(f.value) ? f.value.join(",") : f.value;
    });
    return out;
  }
}

/** Fluent builder for entity queries. */
export class FluentEntity<TAttributes extends EntityAttributes = EntityAttributes> {
  private readonly service: EntityService;
  private readonly identifier: EntityIdentifier;
  private readonly typeName: string;
  private readonly qb: JsonApiQueryBuilder = new JsonApiQueryBuilder();
  private targetId: string | null = null;
  private externalParams: Record<string, unknown> | null = null;

  constructor(service: EntityService, identifier: EntityIdentifier) {
    this.service = service;
    this.identifier = identifier;
    this.typeName = `${identifier.entity}--${identifier.bundle}`;
  }

  public select(fields: string[]): this {
    this.qb.select(this.typeName, fields);
    return this;
  }
  public include(paths: string[]): this {
    this.qb.include(paths);
    return this;
  }
  public sort(field: string, dir: SortDirection = "ASC"): this {
    this.qb.sort(field, dir);
    return this;
  }
  public page(opts: PageOptions): this {
    this.qb.page(opts);
    return this;
  }
  /** Accept plain query object to merge into built params. */
  public params(obj: Record<string, unknown>): this {
    this.externalParams = { ...(this.externalParams ?? {}), ...obj };
    return this;
  }
  /** Accept drupal-jsonapi-params instance via duck-typing */
  public fromParams(p: { getQueryObject?: () => Record<string, unknown> }): this {
    // eslint-disable-next-line @typescript-eslint/strict-boolean-expressions
    const obj = p && typeof p.getQueryObject === "function" ? p.getQueryObject() : {};
    this.externalParams = { ...(this.externalParams ?? {}), ...obj };
    return this;
  }

  // Filters
  public whereEq(field: string, value: string | number | boolean): this {
    this.qb.where(field, value, "=");
    return this;
  }
  public whereContains(field: string, value: string): this {
    this.qb.where(field, value, "CONTAINS");
    return this;
  }
  public whereIn(field: string, values: Array<string | number>): this {
    this.qb.where(field, values, "IN");
    return this;
  }
  public whereRange(field: string, opts: { gte?: number | string; lte?: number | string }): this {
    if (opts.gte !== undefined) this.qb.where(field, opts.gte, ">=");
    if (opts.lte !== undefined) this.qb.where(field, opts.lte, "<=");
    return this;
  }

  public id(id: string): this {
    this.targetId = id;
    return this;
  }

  public async list(options?: EntityListOptions): Promise<Array<EntityRecord<TAttributes>>> {
    const q = this.qb.toObject();
    const opts: EntityListOptions = {
      ...options,
      jsonapi: {
        query: { ...(options?.jsonapi?.query ?? {}), ...(this.externalParams ?? {}), ...q },
      },
    };
    return this.service.list<TAttributes>(this.identifier, opts);
  }

  /** Paginated list with metadata when adapter supports it. */
  public async listPage(
    options?: EntityListOptions
  ): Promise<{ items: Array<EntityRecord<TAttributes>>; page?: unknown }> {
    const q = this.qb.toObject();
    const opts: EntityListOptions = {
      ...options,
      jsonapi: {
        query: { ...(options?.jsonapi?.query ?? {}), ...(this.externalParams ?? {}), ...q },
      },
    };
    const svc = this.service as {
      listPage?: (
        id: EntityIdentifier,
        o?: EntityListOptions
      ) => Promise<{
        items: Array<EntityRecord<TAttributes>>;
        page?: unknown;
      }>;
    };
    if (typeof svc.listPage === "function") {
      return svc.listPage(this.identifier, opts);
    }
    const items = await this.service.list<TAttributes>(this.identifier, opts);
    return { items };
  }

  public async get(options?: EntityLoadOptions): Promise<EntityRecord<TAttributes>> {
    if (typeof this.targetId !== "string" || this.targetId.length === 0) {
      throw new Error("No id() set for get()");
    }
    const q = this.qb.toObject();
    const opts: EntityLoadOptions = {
      ...options,
      jsonapi: {
        query: { ...(options?.jsonapi?.query ?? {}), ...(this.externalParams ?? {}), ...q },
      },
    };
    return this.service.load<TAttributes>(this.identifier, this.targetId, opts);
  }

  /** Fetch the first item from the list result using current filters. */
  public async findOne(options?: EntityListOptions): Promise<EntityRecord<TAttributes> | null> {
    const items = await this.page({ limit: 1 }).list(options);
    return items.length > 0 ? items[0] : null;
  }

  /** Get a count for the current filters if the adapter supports it; fallback to list length. */
  public async count(options?: EntityListOptions): Promise<number> {
    try {
      const q = this.qb.toObject();
      const opts: EntityListOptions = {
        ...options,
        jsonapi: {
          query: { ...(options?.jsonapi?.query ?? {}), ...(this.externalParams ?? {}), ...q },
        },
      };
      // Prefer service.count if available
      const serviceWithCount = this.service as {
        count?: (id: EntityIdentifier, o?: EntityListOptions) => Promise<number>;
      };
      if (serviceWithCount.count && typeof serviceWithCount.count === "function") {
        return await (
          this.service as unknown as {
            count: (id: EntityIdentifier, o?: EntityListOptions) => Promise<number>;
          }
        ).count(this.identifier, opts);
      }
      const all = await this.list(options);
      return all.length;
    } catch (_e) {
      const all = await this.list(options);
      return all.length;
    }
  }
}
