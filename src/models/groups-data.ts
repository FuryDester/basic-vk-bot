import BaseModel from '@/models/base-model';
import GroupDto from '@/data-transfer-objects/models/group-dto';

class GroupsData extends BaseModel {
  getTableName(): string {
    return 'groups';
  }

  protected getTableOptions(): Record<string, unknown> {
    return { indices: ['id'] };
  }

  protected getDto(): GroupDto {
    return new GroupDto();
  }
}

export default GroupsData;
