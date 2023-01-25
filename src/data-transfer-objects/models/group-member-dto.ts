import type { GroupMemberPermission } from '@/types';
import BaseDto from '@/data-transfer-objects/base-dto';

class GroupMemberDto implements BaseDto {
  user_id: number;

  permissions: GroupMemberPermission[];
}

export default GroupMemberDto;
