import BaseModel from '@/models/base-model';
import BaseDto from '@/data-transfer-objects/base-dto';
import GroupDto from '@/data-transfer-objects/models/group-dto';

class GroupsData extends BaseModel {
  getTableName(): string {
    return 'groups';
  }

  protected getTableOptions(): Record<string, unknown> {
    return { indices: ['id'] };
  }

  protected getDto(): BaseDto & object {
    return new GroupDto();
  }
}

export default GroupsData;
