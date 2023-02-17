import BaseModel from '@/models/base-model';
import LogDto from '@/data-transfer-objects/misc/log-dto';

class Logs extends BaseModel {
  protected getTableName(): string {
    return 'logs';
  }

  protected getTableOptions(): Record<string, unknown> | undefined {
    return undefined;
  }

  protected getDto(): LogDto {
    return new LogDto();
  }
}

export default Logs;
