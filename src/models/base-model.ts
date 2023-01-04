import { DatabaseClient, databaseClient as mainDbClient } from '@/wrappers/database-client';

abstract class BaseModel {
  protected modelExists: boolean;

  protected id: number | string | null;

  private data: Record<string, unknown>;

  private dbClient: DatabaseClient;

  protected constructor(databaseClient?: DatabaseClient) {
    this.id = null;

    this.modelExists = false;

    this.data = {};

    this.dbClient = databaseClient || mainDbClient;
  }

  getAllData(): Record<string, unknown> {
    return this.data;
  }

  setAllData(data: Record<string, unknown>): BaseModel {
    this.data = data;

    return this;
  }

  isModelExists(): boolean {
    return this.modelExists;
  }

  protected abstract getTableName(): string;

  protected getTableInstance(): Collection<object> {
    return this.dbClient.getOrAddCollection(this.getTableName());
  }

  getById(id: number | string, fieldName: string = '_id'): object & LokiObj {
    const data = this.getTableInstance().findOne({ [fieldName]: id });

    this.processData(data, fieldName);

    return data;
  }

  getOne(query?: Record<string, unknown>): object & LokiObj {
    const data = this.getTableInstance().findOne(query);

    this.processData(data);

    return data;
  }

  find(query?: Record<string, unknown>): (object & LokiObj)[] {
    return this.getTableInstance().find(query);
  }

  private processData(data?: object & LokiObj, idField?: string): void {
    if (!data) {
      this.id = null;
      this.data = {};
      this.modelExists = false;

      return;
    }

    if (idField) {
      this.id = data[idField];
    } else {
      this.id =
        (data as Record<string, string | number>)._id
        || (data as Record<string, string | number>).id
        || null;
    }

    this.data = data as Record<string, unknown>;

    this.modelExists = !!this.id;
  }

  insert(data: Record<string, unknown> | Record<string, unknown>[]): object & LokiObj | (object & LokiObj)[] {
    const insertedData = this.getTableInstance().insert(data);

    if (!Array.isArray(insertedData)) {
      this.processData(insertedData as object & LokiObj);
    } else {
      this.processData();
    }

    return insertedData as object & LokiObj | (object & LokiObj)[];
  }

  update() {
    this.getTableInstance().findAndUpdate();
  }
}

export default BaseModel;
