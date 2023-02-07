import BaseListener from '@/events/base-listener';
import type { HandlerEvent } from '@/types';
import { HandlerEventEnum, LogTagEnum } from '@/enums';
import GroupsData from '@/models/groups-data';
import Logger from '@/wrappers/logger';
import GroupDto from '@/data-transfer-objects/models/group-dto';
import GroupMemberDto from '@/data-transfer-objects/models/group-member-dto';
import processTechAnswer from '@/logic/helpers/chat/process-tech-answer';
import hasTechStatisticsAbility from '@/logic/helpers/misc/has-tech-statistics-ability';
import VkClient from '@/wrappers/vk-client';
import isAdminChat from '@/logic/helpers/misc/is-admin-chat';

class MessageReplyEventListener extends BaseListener {
  getEventName(): HandlerEvent {
    return HandlerEventEnum.MessageReply;
  }

  protected handleEvent(data: VkBotContext): void {
    const groupsDataModel = new GroupsData();
    const groupObject = groupsDataModel.getTable().findOne({ id: data.groupId } as object);
    if (!groupObject) {
      Logger.error(`Group with id ${data.groupId} not found in database`, LogTagEnum.Handler);
      return;
    }

    const group = groupsDataModel.formDto(groupObject) as GroupDto;
    const user = group.members.find((member) => member.user_id === data.message.from_id) as GroupMemberDto;
    if (!user) {
      return;
    }

    if (
      hasTechStatisticsAbility(group, user)
      && !VkClient.isConversationMessage(data)
      && !isAdminChat(data, group)
    ) {
      if (processTechAnswer(data, this.getEventName())) {
        Logger.info(
          `Tech answer processed for message ${data.message.id}, group id: ${data.groupId}, user: ${data.message.from_id} (message_edit)`,
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

export default MessageReplyEventListener;
