import type { GroupPermission } from '@/types';
import GroupMemberDto from '@/data-transfer-objects/models/group-member-dto';
import Lokiable from '@/data-transfer-objects/lokiable';

class GroupDto extends Lokiable {
  id: number;

  name: string;

  token: string;

  members: GroupMemberDto[];

  permissions: GroupPermission[];
}

export default GroupDto;
