import type { GroupPermission } from '@/types';
import GroupMemberDto from '@/data-transfer-objects/models/group-member-dto';
import BaseDto from '@/data-transfer-objects/base-dto';

class GroupDto implements BaseDto {
  id: number;

  name: string;

  token: string;

  members: GroupMemberDto[];

  permissions: GroupPermission[];
}

export default GroupDto;
