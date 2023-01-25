import BaseModel from '@/models/base-model';
import LogDto from '@/data-transfer-objects/misc/log-dto';
import BaseDto from '@/data-transfer-objects/base-dto';

class Logs extends BaseModel {
  protected getTableName(): string {
    return 'logs';
  }

  protected getTableOptions(): Record<string, unknown> | undefined {
    return undefined;
  }

  protected getDto(): BaseDto & object {
    return new LogDto();
  }
}

export default Logs;
