import BaseCommand from '@/logic/commands/base-command';
import type { CommandType, GroupMemberPermission, GroupPermission } from '@/types';
import CommandArgumentDto from '@/data-transfer-objects/misc/command-argument-dto';
import GroupDto from '@/data-transfer-objects/models/group-dto';
import GroupMemberDto from '@/data-transfer-objects/models/group-member-dto';
import { CommandTypeEnum, GroupMemberPermissionEnum, GroupPermissionEnum, LogTagEnum } from '@/enums';
import Logger from '@/wrappers/logger';
import getUserIdByMention from '@/logic/helpers/misc/get-user-id-by-mention';
import ConversationMembers from '@/models/conversation-members';
import ConversationMemberDto from '@/data-transfer-objects/models/conversation-member-dto';
import sendUnmuteMessage from '@/logic/helpers/misc/send-unmute-message';

class UnmuteCommand extends BaseCommand {
  async execute(
    context: VkBotContext,
    group: GroupDto,
    user: GroupMemberDto,
    args: CommandArgumentDto[],
    _additionalInfo?: unknown,
  ): Promise<boolean> {
    const userArg = args.find((arg) => arg.position === 1)?.argumentValue.trim();
    if (!userArg) {
      Logger.warning(`No user specified. Group: ${group.id}, user: ${user.user_id}, conversation: ${context.message.peer_id}`, LogTagEnum.Command);
      context.reply('Не указан пользователь');

      return false;
    }

    const userId = getUserIdByMention(userArg);
    if (!userId) {
      Logger.warning(
        `Invalid user specified. Group: ${group.id}, user: ${user.user_id}, conversation: ${context.message.peer_id}`,
        LogTagEnum.Command,
      );
      context.reply('Не найдено упоминание пользователя');

      return false;
    }

    const conversationMembers = new ConversationMembers();
    const conversationMembersTable = conversationMembers.getTable();
    const conversationMember = conversationMembersTable.findOne({
      group_id        : group.id,
      conversation_id : context.message.peer_id,
      user_id         : userId,
    } as object);
    const userDto = conversationMembers.formDto(conversationMember) as ConversationMemberDto;

    if (!conversationMember || !userDto.last_mute) {
      Logger.warning(
        `User is not muted. Group: ${group.id}, user: ${user.user_id}, conversation: ${context.message.peer_id}`,
        LogTagEnum.Command,
      );
      context.reply('Пользователь не замучен');

      return false;
    }

    userDto.last_mute.expires_at = 0;
    if (userDto.$loki) {
      conversationMembersTable.update(userDto);
    } else {
      conversationMembersTable.insert(userDto);
    }

    context.reply('Пользователь размучен');
    await sendUnmuteMessage(group.id, userId, context.message.peer_id);

    return true;
  }

  getArguments(): CommandArgumentDto[] {
    const user = new CommandArgumentDto();
    user.position = 1;
    user.isOptional = false;
    user.isLong = true;
    user.description = 'Упоминание пользователя';
    user.alias = 'упоминание';

    return [user];
  }

  getCommandType(): CommandType {
    return CommandTypeEnum.Conversation;
  }

  getDescription(): string {
    return 'Снимает мут с пользователя';
  }

  getGroupMemberPermissions(): GroupMemberPermission[] {
    return [GroupMemberPermissionEnum.CommandUnmute];
  }

  getGroupPermissions(): GroupPermission[] {
    return [GroupPermissionEnum.ConversationCommands];
  }

  getName(): string {
    return 'unmute';
  }

  getUsage(): string {
    return '/unmute [упоминание]';
  }
}

export default UnmuteCommand;
