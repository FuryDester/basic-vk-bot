import type { GroupMemberPermission } from '@/types';

class GroupMemberDto {
  user_id: number;

  permissions: GroupMemberPermission[];
}

export default GroupMemberDto;
