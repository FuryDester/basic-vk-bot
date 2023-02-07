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

class UnwarnCommand extends BaseCommand {
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

    if (!conversationMember || !userDto.warns?.length || (userDto.warns.length - (userDto.warns_removed ?? 0)) <= 0) {
      Logger.warning(
        `User has no warns. Group: ${group.id}, user: ${user.user_id}, conversation: ${context.message.peer_id}`,
        LogTagEnum.Command,
      );
      context.reply('У пользователя нет предупреждений');

      return true;
    }

    userDto.warns_removed = (userDto.warns_removed ?? 0) + 1;
    conversationMembersTable.update(userDto);
    context.reply(`Предупреждение снято. Остаток предупреждений: ${userDto.warns.length - (userDto.warns_removed ?? 0)}`);

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
    return 'Снимает предупреждение с пользователя';
  }

  getGroupMemberPermissions(): GroupMemberPermission[] {
    return [GroupMemberPermissionEnum.CommandUnwarn];
  }

  getGroupPermissions(): GroupPermission[] {
    return [GroupPermissionEnum.ConversationCommands];
  }

  getName(): string {
    return 'unwarn';
  }

  getUsage(): string {
    return '/unwarn [упоминание]';
  }
}

export default UnwarnCommand;
