import { DatabaseClient, databaseClient as mainDbClient } from '@/wrappers/database-client';
import BaseDto from '@/data-transfer-objects/base-dto';
import Lokiable from '@/data-transfer-objects/lokiable';

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

  protected abstract getDto(): BaseDto & object | Lokiable & object;

  public formDto(data: object & LokiObj): BaseDto & object | Lokiable & object {
    const dto = this.getDto();
    Object.assign(dto, data);

    return dto;
  }

  public formDtos(data: (object & LokiObj)[]): (BaseDto & object | Lokiable & object)[] {
    return data.map((item) => this.formDto(item));
  }
}

export default BaseModel;
