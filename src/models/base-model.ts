import { DatabaseClient, databaseClient as mainDbClient } from '@/wrappers/database-client';

abstract class BaseModel {
  private databaseClient: DatabaseClient;

  constructor(databaseClient: DatabaseClient = mainDbClient) {
    this.databaseClient = databaseClient;
  }

  protected abstract getTableName(): string;

  public getTable(): Collection<object> {
    return this.databaseClient.getOrAddCollection(this.getTableName());
  }
}

export default BaseModel;
