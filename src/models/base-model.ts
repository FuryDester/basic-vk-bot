import { DatabaseClient, databaseClient as mainDbClient } from '@/wrappers/database-client';
import BaseDto from '@/data-transfer-objects/base-dto';

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

  protected abstract getDto(): BaseDto & object;

  public formDto(data: object & LokiObj) {
    const dto = this.getDto();
    const formableData = data;
    // Removing LokiJS internal properties
    delete formableData.$loki;
    delete formableData.meta;

    Object.assign(dto, formableData);

    return dto;
  }
}

export default BaseModel;
