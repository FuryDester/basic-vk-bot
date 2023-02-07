import BaseCommand from '@/logic/commands/base-command';
import GroupDto from '@/data-transfer-objects/models/group-dto';
import GroupMemberDto from '@/data-transfer-objects/models/group-member-dto';
import CommandArgumentDto from '@/data-transfer-objects/misc/command-argument-dto';
import { CommandTypeEnum, GroupMemberPermissionEnum, GroupPermissionEnum, LogTagEnum } from '@/enums';
import type { CommandType, GroupMemberPermission, GroupPermission } from '@/types';
import Logger from '@/wrappers/logger';
import getTimeInSeconds from '@/logic/helpers/misc/get-time-in-seconds';
import ConversationMembers from '@/models/conversation-members';
import ConversationMemberDto from '@/data-transfer-objects/models/conversation-member-dto';
import mutePerson from '@/logic/helpers/conversation/mute-person';

class MuteCommand extends BaseCommand {
  async execute(
    context: VkBotContext,
    group: GroupDto,
    user: GroupMemberDto,
    args: CommandArgumentDto[],
    _additionalInfo?: unknown,
  ): Promise<boolean> {
    const time = args.find((arg) => arg.position === 1)?.argumentValue.trim();
    const reason = args.find((arg) => arg.position === 2)?.argumentValue.trim();
    if (!time || !reason) {
      context.reply('Не указано время или причина мута');
      Logger.warning('Not enough arguments for mute command.', LogTagEnum.Command);

      return false;
    }

    if (!context.message.reply_message) {
      context.reply('Необходимо ответить на сообщение пользователя');
      Logger.warning('Not enough arguments for mute command (no message reply).', LogTagEnum.Command);

      return false;
    }

    if (group.members.find((member) => member.user_id === context.message.reply_message.from_id)) {
      Logger.warning(`Target user is admin. Group: ${group.id}, user: ${user.user_id}, message: ${context.message.id}`, LogTagEnum.Command);
      context.reply('Администраторам нельзя выдать мут');

      return false;
    }

    const seconds = getTimeInSeconds(time);
    if (!seconds) {
      context.reply('Не удалось распознать время');
      Logger.warning(`Could not parse time for mute command. Time string: ${time}`, LogTagEnum.Command);

      return false;
    }

    const conversationMembers = new ConversationMembers();
    const conversationMembersTable = conversationMembers.getTable();
    const conversationMember = conversationMembersTable.findOne({
      group_id        : group.id,
      conversation_id : context.message.peer_id,
      user_id         : context.message.reply_message.from_id,
    } as object);
    const userDto = conversationMembers.formDto(conversationMember) as ConversationMemberDto;

    userDto.user_id = userDto.user_id || context.message.reply_message.from_id;
    userDto.group_id = userDto.group_id || group.id;
    userDto.conversation_id = userDto.conversation_id || context.message.peer_id;
    userDto.mutes = Array.isArray(userDto.mutes) ? userDto.mutes : [];

    const finalUserDto = mutePerson(
      userDto,
      context,
      seconds * 1000,
      reason,
    );
    if (!finalUserDto) {
      return false;
    }

    if (finalUserDto.$loki) {
      conversationMembersTable.update(finalUserDto);
    } else {
      conversationMembersTable.insert(finalUserDto);
    }

    return true;
  }

  getArguments(): CommandArgumentDto[] {
    const timeArg = new CommandArgumentDto();
    timeArg.position = 1;
    timeArg.isOptional = false;
    timeArg.isLong = false;
    timeArg.alias = 'время';
    timeArg.description = 'Время, на которое выдаётся мут';

    const reasonArg = new CommandArgumentDto();
    reasonArg.position = 2;
    reasonArg.isOptional = false;
    reasonArg.alias = 'причина';
    reasonArg.description = 'Причина выдачи мута';
    reasonArg.isLong = true;

    return [timeArg, reasonArg];
  }

  getCommandType(): CommandType {
    return CommandTypeEnum.Conversation;
  }

  getDescription(): string {
    return 'Выдаёт мут пользователю';
  }

  getGroupMemberPermissions(): GroupMemberPermission[] {
    return [GroupMemberPermissionEnum.CommandMute];
  }

  getGroupPermissions(): GroupPermission[] {
    return [GroupPermissionEnum.ConversationCommands];
  }

  getName(): string {
    return 'mute';
  }

  getUsage(): string {
    return '/mute [время] [причина] + пересланное сообщение\nВремя задаётся в формате: 1w2d1h30m10s';
  }
  
}

export default MuteCommand;
