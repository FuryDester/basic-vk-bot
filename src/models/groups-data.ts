import BaseModel from '@/models/base-model';

class GroupsData extends BaseModel {
  getTableName(): string {
    return 'groups';
  }
}

export default GroupsData;
