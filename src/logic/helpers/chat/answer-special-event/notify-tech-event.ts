import BaseSpecialEvent from '@/logic/helpers/chat/answer-special-event/base-special-event';
import { AnswerSpecialEventEnum, GroupMemberPermissionEnum, LogTagEnum } from '@/enums';
import type { AnswerSpecialEvent } from '@/types';
import GroupDto from '@/data-transfer-objects/models/group-dto';
import GroupsData from '@/models/groups-data';
import getClientByGroupId from '@/logic/helpers/misc/get-client-by-group-id';
import getUserTap from '@/logic/helpers/misc/get-user-tap';
import Logger from '@/wrappers/logger';

class NotifyTechEvent implements BaseSpecialEvent {
  getSpecialEventCode(): AnswerSpecialEvent {
    return AnswerSpecialEventEnum.NotifyTech;
  }

  async handle(context: VkBotContext): Promise<boolean> {
    const groupModel = new GroupsData();
    const groupTable = groupModel.getTable();
    const group = groupModel.formDto(groupTable.findOne({
      id: context.groupId,
    } as object)) as GroupDto;

    const notifiableMembers = group.members.filter((item) => item.permissions.includes(GroupMemberPermissionEnum.CountTechStatistics));
    if (!notifiableMembers.length) {
      return true;
    }

    const memberIds = notifiableMembers.map((item) => item.user_id);
    const client = getClientByGroupId(group.id);

    try {
      const userInfo = await client.getUserInfo(context.message.peer_id);
      const userTap = getUserTap(userInfo.id, `${userInfo.first_name} ${userInfo.last_name}`);

      await client.sendMessage(memberIds, `Новое обращение в группе. Пользователь: ${userTap}`);

      Logger.info(`Sent tech notify. Group id: ${group.id}`, LogTagEnum.System);

      return true;
    } catch (e) {
      Logger.warning(`Error while sending notify. Group id: ${group.id}, error: ${e.message}`, LogTagEnum.System);

      return false;
    }
  }
}

export default NotifyTechEvent;
