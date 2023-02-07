import BaseCommand from '@/logic/commands/base-command';
import CommandArgumentDto from '@/data-transfer-objects/misc/command-argument-dto';
import GroupMemberDto from '@/data-transfer-objects/models/group-member-dto';
import GroupDto from '@/data-transfer-objects/models/group-dto';
import type { CommandType, GroupMemberPermission, GroupPermission } from '@/types';
import { CommandTypeEnum, GroupMemberPermissionEnum, GroupPermissionEnum, LogTagEnum } from '@/enums';
import Logger from '@/wrappers/logger';
import ConversationMembers from '@/models/conversation-members';
import ConversationMemberDto from '@/data-transfer-objects/models/conversation-member-dto';
import * as moment from 'moment';
import { clients } from '@/index';
import VkClient from '@/wrappers/vk-client';
import getUserTap from '@/logic/helpers/misc/get-user-tap';
import getUserIdByMention from '@/logic/helpers/misc/get-user-id-by-mention';

class WarnsCommand extends BaseCommand {
  async execute(
    context: VkBotContext,
    group: GroupDto,
    user: GroupMemberDto,
    args: CommandArgumentDto[],
    _additionalInfo?: unknown,
  ): Promise<boolean> {
    const userArg = args.find((arg) => arg.position === 1)?.argumentValue.trim();
    if (!userArg) {
      context.reply('Не указан пользователь');
      Logger.warning(`No user specified. Group: ${group.id}, user: ${user.user_id}, conversation: ${context.message.peer_id}`, LogTagEnum.Command);

      return false;
    }

    const userId = getUserIdByMention(userArg);
    if (!userId) {
      context.reply('Не найдено упоминание пользователя');
      // eslint-disable-next-line max-len
      Logger.warning(`Cannot find user mention. Group: ${group.id}, user: ${user.user_id}, conversation: ${context.message.peer_id}`, LogTagEnum.Command);

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
    if (!conversationMember || userDto.warns?.length === 0) {
      context.reply('Пользователю не выдавались наказания в этой беседе.');
      Logger.info(`User has no punishments. Group: ${group.id}, user: ${user.user_id}, conversation: ${context.message.peer_id}`, LogTagEnum.Command);

      return true;
    }

    let finalString = 'Пользователь получил следующие предупреждения:';
    let moderatorTaps = {};
    const usedClient = clients.find((client) => client.groupId === group.id) as VkClient;
    if (!usedClient) {
      Logger.error(`Cannot find client for group ${group.id}`, LogTagEnum.Command);

      return false;
    }

    let iterator = 1;
    for (const warn of userDto.warns.reverse()) {
      if (!moderatorTaps[warn.given_by]) {
        const userInfo = await usedClient.getUserInfo(warn.given_by);
        moderatorTaps[warn.given_by] = getUserTap(warn.given_by, `${userInfo.first_name} ${userInfo.last_name}`);
      }

      finalString +=
        `\n${iterator++}. ${warn.reason.trim()}, выдан ${moderatorTaps[warn.given_by]} ${moment(warn.given_at).format('DD.MM.YYYY HH:mm:ss')}`;
    }

    context.reply(finalString);

    return false;
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
    return 'Выдаёт информацию о предупреждениях пользователя';
  }

  getGroupMemberPermissions(): GroupMemberPermission[] {
    return [GroupMemberPermissionEnum.CommandWarns];
  }

  getGroupPermissions(): GroupPermission[] {
    return [GroupPermissionEnum.ConversationCommands];
  }

  getName(): string {
    return 'warns';
  }

  getUsage(): string {
    return '/warns [упоминание пользователя]';
  }
}

export default WarnsCommand;
