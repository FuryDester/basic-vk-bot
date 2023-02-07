import BaseCommand from '@/logic/commands/base-command';
import type { CommandType, GroupMemberPermission, GroupPermission } from '@/types';
import GroupDto from '@/data-transfer-objects/models/group-dto';
import GroupMemberDto from '@/data-transfer-objects/models/group-member-dto';
import CommandArgumentDto from '@/data-transfer-objects/misc/command-argument-dto';
import { CommandTypeEnum, GroupMemberPermissionEnum, GroupPermissionEnum, LogTagEnum } from '@/enums';
import Logger from '@/wrappers/logger';
import ConversationMembers from '@/models/conversation-members';
import ConversationMemberDto from '@/data-transfer-objects/models/conversation-member-dto';
import WarnDto from '@/data-transfer-objects/misc/warn-dto';
import mutePerson from '@/logic/helpers/conversation/mute-person';
import * as moment from 'moment';
import { clients } from '@/index';
import VkClient from '@/wrappers/vk-client';
import getUserTap from '@/logic/helpers/misc/get-user-tap';

const muteTime = 60 * 60 * 24 * 3 * 1000;

class WarnCommand extends BaseCommand {
  private static get getMuteTime(): number {
    return muteTime;
  }

  async execute(
    context: VkBotContext,
    group: GroupDto,
    user: GroupMemberDto,
    args: CommandArgumentDto[],
    _additionalInfo?: unknown,
  ): Promise<boolean> {
    const reason = args.find((arg) => arg.position === 1)?.argumentValue;
    if (!reason) {
      Logger.warning(`No warn reason specified. Group: ${group.id}, user: ${user.user_id}, message: ${context.message.id}`, LogTagEnum.Command);
      context.reply('Не указана причина выдачи предупреждения');

      return false;
    }

    const replyMessage = context.message.reply_message;
    if (!replyMessage) {
      Logger.warning(`No reply message specified. Group: ${group.id}, user: ${user.user_id}, message: ${context.message.id}`, LogTagEnum.Command);
      context.reply('Не указано сообщение, по которому выдаётся предупреждение');

      return false;
    }

    const targetUserId = replyMessage.from_id;
    if (group.members.find((member) => member.user_id === targetUserId)) {
      Logger.warning(`Target user is admin. Group: ${group.id}, user: ${user.user_id}, message: ${context.message.id}`, LogTagEnum.Command);
      context.reply('Администраторам нельзя выдать предупреждение');

      return false;
    }

    const conversationMemberModel = new ConversationMembers();
    const conversationMemberTable = conversationMemberModel.getTable();

    const conversationUser = conversationMemberTable.findOne({
      group_id        : group.id,
      user_id         : targetUserId,
      conversation_id : context.message.peer_id,
    } as object);

    let userDto = new ConversationMemberDto();
    if (conversationUser) {
      userDto = conversationMemberModel.formDto(conversationUser) as ConversationMemberDto;
    }

    const warnDto = new WarnDto();
    warnDto.given_at = context.message.date * 1000;
    warnDto.given_by = user.user_id;
    warnDto.message_id = replyMessage.id;
    warnDto.reason = reason;

    if (!userDto.warns) {
      userDto.warns = [];
    }
    userDto.warns.push(warnDto);

    const usedClient = clients.find((client) => client.groupId === group.id) as VkClient;
    if (!usedClient) {
      Logger.error(`Failed to find client for group ${group.id}`, LogTagEnum.Command);
      return false;
    }

    const userInfo = await usedClient.getUserInfo(targetUserId);
    if (!userInfo) {
      Logger.error(`Failed to get user info for user ${targetUserId}`, LogTagEnum.Command);
      return false;
    }
    const userTap = getUserTap(targetUserId, `${userInfo.first_name} ${userInfo.last_name}`);

    if (!(userDto.warns.length % 3)) {
      const resultUserDto = mutePerson(
        userDto,
        context,
        WarnCommand.getMuteTime,
        'Вы получили мут за 3 предупреждения',
        false,
      );

      if (!resultUserDto) {
        Logger.error(`Failed to mute user. Group: ${group.id}, user: ${user.user_id}, message: ${context.message.id}`, LogTagEnum.Command);
        return false;
      }

      userDto = resultUserDto;
      const muteEndsString = moment(Date.now() + WarnCommand.getMuteTime).format('DD.MM.YYYY HH:mm:ss');
      context.reply(`Пользователь ${userTap} получил мут за 3 предупреждения. Мут истечёт: ${muteEndsString}`);
    } else {
      context.reply(`Пользователь ${userTap} получил предупреждение. Всего предупреждений: ${userDto.warns.length}`);
    }

    if (!userDto.$loki) {
      userDto.is_admin = false;
      userDto.group_id = group.id;
      userDto.conversation_id = context.message.peer_id;
      userDto.user_id = targetUserId;
      userDto.mutes = [];

      conversationMemberTable.insert(userDto);
    } else {
      conversationMemberTable.update(userDto);
    }

    return true;
  }

  getArguments(): CommandArgumentDto[] {
    const reason = new CommandArgumentDto();
    reason.position = 1;
    reason.isLong = true;
    reason.isOptional = false;
    reason.alias = 'причина';
    reason.description = 'Причина выдачи предупреждения';

    return [reason];
  }

  getCommandType(): CommandType {
    return CommandTypeEnum.Conversation;
  }

  getDescription(): string {
    // eslint-disable-next-line max-len
    return 'Выдаёт предупреждение пользователю. При достижении 3 предупреждений пользователь получит мут. Необходимо ответить на сообщение пользователя, которому выдаётся предупреждение';
  }

  getGroupMemberPermissions(): GroupMemberPermission[] {
    return [GroupMemberPermissionEnum.CommandWarn];
  }

  getGroupPermissions(): GroupPermission[] {
    return [GroupPermissionEnum.ConversationCommands];
  }

  getName(): string {
    return 'warn';
  }

  getUsage(): string {
    return 'warn [причина] + ответ на сообщение пользователя';
  }
}

export default WarnCommand;
