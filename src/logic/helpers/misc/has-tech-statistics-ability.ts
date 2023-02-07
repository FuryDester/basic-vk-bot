import GroupDto from '@/data-transfer-objects/models/group-dto';
import GroupMemberDto from '@/data-transfer-objects/models/group-member-dto';
import { GroupMemberPermissionEnum, GroupPermissionEnum } from '@/enums';

export default (group: GroupDto, user: GroupMemberDto): boolean => {
  return (
    group.permissions.includes(GroupPermissionEnum.TechStatistics)
    || group.permissions.includes(GroupPermissionEnum.All)
  ) && (
    user.permissions.includes(GroupMemberPermissionEnum.CountTechStatistics)
      || user.permissions.includes(GroupMemberPermissionEnum.All)
  );
};
