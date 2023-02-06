import ConversationMembers from '@/models/conversation-members';
import ConversationMemberDto from '@/data-transfer-objects/models/conversation-member-dto';
import Logger from '@/wrappers/logger';
import { LogTagEnum } from '@/enums';
import { clients } from '@/index';
import VkClient from '@/wrappers/vk-client';
import * as moment from 'moment';
import getUserTap from '@/logic/helpers/misc/get-user-tap';

const NOT_MUTED_LOG_MESSAGE = 'User %s is not muted';

export default async (ctx: VkBotContext): Promise<boolean> => {
  const conversationMemberModel = new ConversationMembers();
  const conversationMemberTable = conversationMemberModel.getTable();

  const conversationUser = conversationMemberTable.findOne({
    group_id        : ctx.groupId,
    user_id         : ctx.message.from_id,
    conversation_id : ctx.message.peer_id,
  } as object);

  const notMutedMessage = NOT_MUTED_LOG_MESSAGE.replace('%s', ctx.message.from_id.toString());

  if (!conversationUser) {
    Logger.info(notMutedMessage, LogTagEnum.Command);
    return false;
  }

  const userDto = conversationMemberModel.formDto(conversationUser) as ConversationMemberDto;
  if (!userDto.last_mute) {
    Logger.info(notMutedMessage, LogTagEnum.Command);
    return false;
  }

  if (userDto.last_mute.expires_at > Date.now()) {
    Logger.info(notMutedMessage, LogTagEnum.Command);
    return false;
  }

  const usedClient = clients.find((client) => client.groupId === ctx.groupId) as VkClient;
  if (!usedClient) {
    Logger.error(`No client found with id: ${ctx.groupId}`, LogTagEnum.Command);
    return false;
  }

  const userInfo = await usedClient.getUserInfo(userDto.last_mute.given_by);
  const userName = `${userInfo.first_name} ${userInfo.last_name}`;
  try {
    await usedClient.sendMessage(
      ctx.message.from_id,
      {
        message: `Вами был получен мут. Он истекает в ${
          moment(userDto.last_mute.expires_at).format('DD.MM.YYYY HH:mm:ss')
        }, причина: ${userDto.last_mute.reason}, выдан модератором: ${
          getUserTap(userDto.last_mute.given_by, userName)
        } в ${moment(userDto.last_mute.given_at).format('DD.MM.YYYY HH:mm:ss')}`,
        forward_messages: userDto.last_mute.message_id,
      },
    );
  } catch (e) {
    Logger.warning(`Failed to send message to user ${ctx.message.from_id}, error: ${e.message}`, LogTagEnum.Command);
  }

  return true;
};
