import BaseModel from '@/models/base-model';
import ActionHelperDto from '@/data-transfer-objects/models/action-helper-dto';

class ActionHelpers extends BaseModel {
  protected getDto(): ActionHelperDto {
    return new ActionHelperDto();
  }

  protected getTableName(): string {
    return 'action_helpers';
  }

  protected getTableOptions(): Record<string, unknown> | undefined {
    return undefined;
  }
}

export default ActionHelpers;
