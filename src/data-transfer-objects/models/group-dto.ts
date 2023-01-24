import type { GroupMember, GroupPermission } from '@/types';

class GroupDto {
  id: number;

  name: string;

  token: string;

  members: GroupMember[];

  permissions: GroupPermission[];
}

export default GroupDto;
