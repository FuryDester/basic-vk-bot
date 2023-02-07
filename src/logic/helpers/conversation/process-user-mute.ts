import ConversationMembers from '@/models/conversation-members';
import ConversationMemberDto from '@/data-transfer-objects/models/conversation-member-dto';
import Logger from '@/wrappers/logger';
import { LogTagEnum } from '@/enums';
import { clients } from '@/index';
import VkClient from '@/wrappers/vk-client';
import * as moment from 'moment';
import getUserTap from '@/logic/helpers/misc/get-user-tap';

const NOT_MUTED_LOG_MESSAGE = 'User %s1 is not muted, group id: %s2, conversation id: %s3';

export default async (ctx: VkBotContext): Promise<boolean> => {
  const conversationMemberModel = new ConversationMembers();
  const conversationMemberTable = conversationMemberModel.getTable();

  const conversationUser = conversationMemberTable.findOne({
    group_id        : ctx.groupId,
    user_id         : ctx.message.from_id,
    conversation_id : ctx.message.peer_id,
  } as object);

  const notMutedMessage = NOT_MUTED_LOG_MESSAGE
    .replace('%s1', ctx.message.from_id.toString())
    .replace('%s2', ctx.groupId.toString())
    .replace('%s3', ctx.message.peer_id.toString());

  if (!conversationUser) {
    Logger.info(notMutedMessage, LogTagEnum.System);
    return false;
  }

  const userDto = conversationMemberModel.formDto(conversationUser) as ConversationMemberDto;
  if (!userDto.last_mute) {
    Logger.info(notMutedMessage, LogTagEnum.System);
    return false;
  }

  if (userDto.last_mute.expires_at < Date.now()) {
    Logger.info(notMutedMessage, LogTagEnum.System);
    return false;
  }

  const usedClient = clients.find((client) => client.groupId === ctx.groupId) as VkClient;
  if (!usedClient) {
    Logger.error(`No client found with id: ${ctx.groupId}`, LogTagEnum.System);
    return false;
  }

  const userInfo = await usedClient.getUserInfo(userDto.last_mute.given_by);
  const userName = `${userInfo.first_name} ${userInfo.last_name}`;
  let sendMessage = true;
  try {
    await usedClient.deleteMessage(ctx.message.peer_id, null, ctx.message.conversation_message_id);
  } catch (e) {
    Logger.warning(`Failed to delete message from user ${ctx.message.from_id}, error: ${e.response.error_msg || e.message}`, LogTagEnum.System);
    sendMessage = false;
  }

  const muteExpiresAt = moment(userDto.last_mute.expires_at).format('DD.MM.YYYY HH:mm:ss');
  const moderatorTap = getUserTap(userDto.last_mute.given_by, userName);
  const muteGivenAt = moment(userDto.last_mute.given_at).format('DD.MM.YYYY HH:mm:ss');
  if (sendMessage) {
    try {
      await usedClient.sendMessage(
        ctx.message.from_id,
        {
          // eslint-disable-next-line max-len
          message : `Вы получили мут в беседе за пересланное сообщение.\nНаказание истекает ${muteExpiresAt}\nНаказание выдано Администратором ${moderatorTap} ${muteGivenAt}\nПричина: ${userDto.last_mute.reason}`,
          forward : JSON.stringify({
            peer_id                  : ctx.message.peer_id,
            conversation_message_ids : [userDto.last_mute.message_id],
          }),
        },
      );
    } catch (e) {
      Logger.warning(`Failed to send message to user ${ctx.message.from_id}, error: ${e.response.error_msg || e.message}`, LogTagEnum.Command);
    }
  }

  return true;
};
