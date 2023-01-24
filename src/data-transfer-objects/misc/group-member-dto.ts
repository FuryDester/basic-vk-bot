import type { GroupMember } from '@/types';

class GroupMemberDto {
  group_id: number;

  user_id: number;

  permissions: GroupMember[];
}

export default GroupMemberDto;
