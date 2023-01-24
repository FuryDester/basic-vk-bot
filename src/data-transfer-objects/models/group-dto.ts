import type { GroupMemberPermission, GroupPermission } from '@/types';

class GroupDto {
  id: number;

  name: string;

  token: string;

  members: GroupMemberPermission[];

  permissions: GroupPermission[];
}

export default GroupDto;
