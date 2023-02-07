import ConversationMemberDto from '@/data-transfer-objects/models/conversation-member-dto';
import MuteDto from '@/data-transfer-objects/misc/mute-dto';
import Logger from '@/wrappers/logger';
import { LogTagEnum } from '@/enums';

export default (
  user: ConversationMemberDto,
  ctx: VkBotContext,
  time: number,
  reason: string,
  sendMessage: boolean = true,
): null | ConversationMemberDto => {
  const userDto = user;

  if (time <= 0) {
    if (sendMessage) {
      // eslint-disable-next-line max-len
      Logger.warning(`Mute time is less than or equal to zero. Group: ${user.group_id}, user: ${user.user_id}, message: ${ctx.message.id}, peer: ${ctx.message.peer_id}`, LogTagEnum.Command);
      ctx.reply('Время должно быть больше нуля');
    }
    return null;
  }

  if (!reason.trim()) {
    if (sendMessage) {
      // eslint-disable-next-line max-len
      Logger.warning(`Mute reason is empty. Group: ${user.group_id}, user: ${user.user_id}, message: ${ctx.message.id}, peer: ${ctx.message.peer_id}`, LogTagEnum.Command);
      ctx.reply('Не указана причина');
    }
    return null;
  }

  if (!ctx.message.reply_message.conversation_message_id) {
    if (sendMessage) {
      // eslint-disable-next-line max-len
      Logger.warning(`Mute message is empty. Group: ${user.group_id}, user: ${user.user_id}, message: ${ctx.message.id}, peer: ${ctx.message.peer_id}`, LogTagEnum.Command);
      ctx.reply('Не указано сообщение, по которому выдаётся предупреждение');
    }
    return null;
  }

  const muteDto = new MuteDto();
  Object.assign(muteDto, {
    user_id    : user.user_id,
    reason,
    message_id : ctx.message.reply_message.conversation_message_id,
    given_at   : Date.now(),
    given_by   : ctx.message.from_id,
    expires_at : Date.now() + time,
  });

  user.mutes.push(muteDto);
  user.last_mute = muteDto;

  Logger.info(`Muted user ${user.user_id} in conversation ${user.conversation_id} (group id: ${ctx.groupId}) for ${time}ms with reason "${reason}"`);
  if (sendMessage) {
    ctx.reply(`Пользователь замучен на ${time / 1000} секунд`);
  }

  return userDto;
};
