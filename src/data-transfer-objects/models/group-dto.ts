import type { GroupPermission } from '@/types';
import GroupMemberDto from '@/data-transfer-objects/models/group-member-dto';

class GroupDto {
  id: number;

  name: string;

  token: string;

  members: GroupMemberDto[];

  permissions: GroupPermission[];
}

export default GroupDto;
