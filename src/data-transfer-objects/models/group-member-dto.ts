import type { GroupMemberPermission } from '@/types';
import Lokiable from '@/data-transfer-objects/lokiable';

class GroupMemberDto extends Lokiable {
  user_id: number;

  permissions: GroupMemberPermission[];
}

export default GroupMemberDto;
