import BaseModel from '@/models/base-model';

class Logs extends BaseModel {
  protected getTableName(): string {
    return 'logs';
  }

  protected getTableOptions(): Record<string, unknown> | undefined {
    return undefined;
  }
}

export default Logs;
