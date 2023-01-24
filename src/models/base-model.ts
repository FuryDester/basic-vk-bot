import { DatabaseClient, databaseClient as mainDbClient } from '@/wrappers/database-client';

abstract class BaseModel {
  private databaseClient: DatabaseClient;

  constructor(databaseClient: DatabaseClient = mainDbClient) {
    this.databaseClient = databaseClient;
  }

  protected abstract getTableName(): string;

  protected abstract getTableOptions(): Record<string, unknown> | undefined;

  public getTable(): Collection<object> {
    return this.databaseClient.getOrAddCollection(this.getTableName(), this.getTableOptions());
  }
}

export default BaseModel;
