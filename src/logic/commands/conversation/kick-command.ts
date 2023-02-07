import BaseCommand from '@/logic/commands/base-command';
import GroupDto from '@/data-transfer-objects/models/group-dto';
import GroupMemberDto from '@/data-transfer-objects/models/group-member-dto';
import CommandArgumentDto from '@/data-transfer-objects/misc/command-argument-dto';
import { CommandType, GroupMemberPermission, GroupPermission } from '@/types';
import { CommandTypeEnum, GroupMemberPermissionEnum, GroupPermissionEnum, LogTagEnum } from '@/enums';
import Logger from '@/wrappers/logger';
import { clients } from '@/index';
import VkClient from '@/wrappers/vk-client';
import getUserTap from '@/logic/helpers/misc/get-user-tap';
import ConversationMembers from '@/models/conversation-members';
import ConversationMemberDto from '@/data-transfer-objects/models/conversation-member-dto';
import KickDto from '@/data-transfer-objects/misc/kick-dto';

class KickCommand extends BaseCommand {
  async execute(
    context: VkBotContext,
    group: GroupDto,
    user: GroupMemberDto,
    args: CommandArgumentDto[],
    _additionalInfo?: unknown,
  ): Promise<boolean> {
    const reason = args.find((arg) => arg.position === 1)?.argumentValue.trim();
    if (!reason) {
      context.reply('Не указана причина кика');
      Logger.warning('Not enough arguments for kick command.', LogTagEnum.Command);

      return false;
    }

    if (!context.message.reply_message) {
      context.reply('Не указано сообщение с упоминанием пользователя');
      Logger.warning('Not enough arguments for kick command (no message).', LogTagEnum.Command);

      return false;
    }

    if (group.members.find((member) => member.user_id === context.message.reply_message.from_id)) {
      Logger.warning(`Target user is admin. Group: ${group.id}, user: ${user.user_id}, message: ${context.message.id}`, LogTagEnum.Command);
      context.reply('Администратора нельзя кикнуть');

      return false;
    }

    const usedClient = clients.find((client) => client.groupId === group.id) as VkClient;
    const userInfo = await usedClient.getUserInfo(context.message.reply_message.from_id);
    const userMention = getUserTap(context.message.reply_message.from_id, `${userInfo.first_name} ${userInfo.last_name}`);

    try {
      await usedClient.removeChatUser(context.message.peer_id - 2000000000, context.message.reply_message.from_id);
    } catch (e) {
      Logger.error(
        `Cannot remove chat user. User: ${context.message.reply_message.from_id}, group: ${group.id}, conversation: ${context.message.peer_id}`,
        LogTagEnum.Command,
      );
      context.reply(`Не удалось кикнуть пользователя ${userMention}. Возможно он не состоит в беседе или произошла иная ошибка.`);

      return false;
    }
    context.reply(`Пользователь ${userMention} был кикнут из беседы по причине: ${reason}`);

    const conversationMembers = new ConversationMembers();
    const conversationMembersTable = conversationMembers.getTable();
    const conversationMember = conversationMembersTable.findOne({
      group_id        : group.id,
      conversation_id : context.message.peer_id,
      user_id         : context.message.reply_message.from_id,
    } as object);
    const userDto = conversationMembers.formDto(conversationMember) as ConversationMemberDto;
    userDto.group_id = userDto.group_id || group.id;
    userDto.user_id = userDto.user_id || context.message.reply_message.from_id;
    userDto.conversation_id = userDto.conversation_id || context.message.peer_id;

    const kickDto = new KickDto();
    kickDto.message_id = context.message.reply_message.conversation_message_id;
    kickDto.reason = reason;
    kickDto.given_at = Date.now();
    kickDto.given_by = user.user_id;

    userDto.kicks = Array.isArray(userDto.kicks) ? userDto.kicks : [];
    userDto.kicks.push(kickDto);

    if (userDto.$loki) {
      conversationMembersTable.update(userDto);
    } else {
      conversationMembersTable.insert(userDto);
    }

    return true;
  }

  getArguments(): CommandArgumentDto[] {
    const reasonArg = new CommandArgumentDto();
    reasonArg.position = 1;
    reasonArg.isOptional = false;
    reasonArg.alias = 'причина';
    reasonArg.description = 'Причина кика';
    reasonArg.isLong = true;

    return [reasonArg];
  }

  getCommandType(): CommandType {
    return CommandTypeEnum.Conversation;
  }

  getDescription(): string {
    return 'Выгоняет пользователя из беседы';
  }

  getGroupMemberPermissions(): GroupMemberPermission[] {
    return [GroupMemberPermissionEnum.CommandKick];
  }

  getGroupPermissions(): GroupPermission[] {
    return [GroupPermissionEnum.ConversationCommands];
  }

  getName(): string {
    return 'kick';
  }

  getUsage(): string {
    return 'kick [причина] + ответ на сообщение пользователя';
  }

}

export default KickCommand;
