import GroupDto from '@/data-transfer-objects/models/group-dto';
import GroupMemberDto from '@/data-transfer-objects/models/group-member-dto';
import { GroupMemberPermissionEnum, GroupPermissionEnum } from '@/enums';

export default (group: GroupDto, user: GroupMemberDto): boolean => {
  return group.permissions.includes(GroupPermissionEnum.TechStatistics)
    && user.permissions.includes(GroupMemberPermissionEnum.CountTechStatistics);
};
