import BaseListener from '@/events/base-listener';
import type { HandlerEvent } from '@/types';
import { HandlerEventEnum, LogTagEnum } from '@/enums';
import GroupsData from '@/models/groups-data';
import Logger from '@/wrappers/logger';
import GroupDto from '@/data-transfer-objects/models/group-dto';
import GroupMemberDto from '@/data-transfer-objects/models/group-member-dto';
import hasTechStatisticsAbility from '@/logic/helpers/misc/has-tech-statistics-ability';
import processTechAnswer from '@/logic/helpers/chat/process-tech-answer';
import VkClient from '@/wrappers/vk-client';
import isAdminChat from '@/logic/helpers/misc/is-admin-chat';

class MessageEditEventListener extends BaseListener {
  getEventName(): HandlerEvent {
    return HandlerEventEnum.MessageEdit;
  }

  protected handleEvent(data: VkBotContext): void {
    const groupsDataModel = new GroupsData();
    const groupObject = groupsDataModel.getTable().findOne({ id: data.groupId } as object);
    if (!groupObject) {
      Logger.error(`Group with id ${data.groupId} not found in database`, LogTagEnum.Handler);
      return;
    }

    let userId = data.message.admin_author_id;
    if (data.message.from_id > 0) {
      userId = data.message.from_id;
    }

    const group = groupsDataModel.formDto(groupObject) as GroupDto;
    const user = group.members.find((member) => member.user_id === userId) as GroupMemberDto;
    if (!user) {
      return;
    }

    if (
      hasTechStatisticsAbility(group, user)
      && !VkClient.isConversationMessage(data)
      && !isAdminChat(data, group)
      && data.message.from_id < 0
    ) {
      if (processTechAnswer(data, this.getEventName())) {
        Logger.info(
          `Tech answer processed for message ${data.message.id}, group id: ${data.groupId}, user: ${userId} (message_edit)`,
          LogTagEnum.Handler,
        );
      } else {
        Logger.warning(
          `Tech answer not processed for message ${data.message.id}, group id: ${data.groupId} (message_edit)`,
          LogTagEnum.Handler,
        );
      }
    }
  }
}

export default MessageEditEventListener;
