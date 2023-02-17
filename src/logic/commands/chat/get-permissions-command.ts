import BaseCommand from '@/logic/commands/base-command';
import CommandArgumentDto from '@/data-transfer-objects/misc/command-argument-dto';
import type { CommandType, GroupMemberPermission, GroupPermission } from '@/types';
import { CommandTypeEnum, GroupMemberPermissionEnum, GroupPermissionEnum, LogTagEnum } from '@/enums';
import GroupDto from '@/data-transfer-objects/models/group-dto';
import GroupMemberDto from '@/data-transfer-objects/models/group-member-dto';
import Logger from '@/wrappers/logger';
import getClientByGroupId from '@/logic/helpers/misc/get-client-by-group-id';
import getUserTap from '@/logic/helpers/misc/get-user-tap';

class MyPermissionsCommand extends BaseCommand {
  getArguments(): CommandArgumentDto[] {
    const user = new CommandArgumentDto();
    user.position = 1;
    user.is_optional = false;
    user.is_long = false;
    user.description = 'Идентификатор пользователя';
    user.alias = 'идентификатор';

    return [user];
  }

  getCommandType(): CommandType {
    return CommandTypeEnum.Chat;
  }

  getDescription(): string {
    return 'Проверка прав пользователя';
  }

  getGroupMemberPermissions(): GroupMemberPermission[] {
    return [GroupMemberPermissionEnum.CommandGetPermissions];
  }

  getGroupPermissions(): GroupPermission[] {
    return [GroupPermissionEnum.ChatCommands];
  }

  getName(): string {
    return 'getpermissions';
  }

  getUsage(): string {
    return 'При использовании команды выводит выданные пользователю права.';
  }

  async execute(
    context: VkBotContext,
    group: GroupDto,
    user: GroupMemberDto,
    args: CommandArgumentDto[],
    _additionalInfo: unknown,
  ): Promise<boolean> {
    const userId = args.find((arg) => arg.position === 1)?.argumentValue;
    if (!userId) {
      Logger.warning(`User id is not passed to command ${this.getName()}`, LogTagEnum.Command);
      context.reply('Не указан идентификатор пользователя');

      return false;
    }

    const client = getClientByGroupId(group.id);
    const userInfo = await client.getUserInfo(userId);
    if (!userInfo) {
      Logger.warning(`User ${userId} not found`, LogTagEnum.Command);
      context.reply('Пользователь не найден');

      return false;
    }

    const numericUserId = userInfo.id;
    const groupMember = group.members.find((member) => member.user_id === numericUserId);
    if (!groupMember) {
      Logger.warning(`User ${userId} not found in group ${group.id}`, LogTagEnum.Command);
      context.reply('У пользователя нет прав');

      return false;
    }

    const userMention = getUserTap(numericUserId, `${userInfo.first_name} ${userInfo.last_name}`);
    context.reply(`${userMention} имеет следующие права: ${groupMember.permissions.join(', ')}`);

    return true;
  }
}

export default MyPermissionsCommand;
