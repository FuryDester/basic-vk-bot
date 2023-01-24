import BaseModel from '@/models/base-model';

class GroupsData extends BaseModel {
  getTableName(): string {
    return 'groups';
  }

  protected getTableOptions(): Record<string, unknown> {
    return { indices: ['id'] };
  }
}

export default GroupsData;
