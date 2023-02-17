import BaseCommand from '@/logic/commands/base-command';
import type { CommandType, GroupMemberPermission, GroupPermission } from '@/types';
import CommandArgumentDto from '@/data-transfer-objects/misc/command-argument-dto';
import GroupDto from '@/data-transfer-objects/models/group-dto';
import GroupMemberDto from '@/data-transfer-objects/models/group-member-dto';
import { CommandTypeEnum, GroupMemberPermissionEnum, GroupPermissionEnum, LogTagEnum } from '@/enums';
import Logger from '@/wrappers/logger';
import GroupsData from '@/models/groups-data';
import getClientByGroupId from '@/logic/helpers/misc/get-client-by-group-id';
import getUserTap from '@/logic/helpers/misc/get-user-tap';

class GivePermissionCommand extends BaseCommand {
  async execute(
    context: VkBotContext,
    group: GroupDto,
    user: GroupMemberDto,
    args: CommandArgumentDto[],
    _additionalInfo?: unknown,
  ): Promise<boolean> {
    const userId = args.find((arg) => arg.position === 1)?.argumentValue;
    const permissionName = args.find((arg) => arg.position === 2)?.argumentValue;
    if (!userId || !permissionName) {
      Logger.warning(`No arguments given for command ${this.getName()} (userId: ${userId}, permission: ${permissionName})`, LogTagEnum.Command);
      context.reply('Не указаны все аргументы команды');

      return false;
    }

    if (!(Object.values(GroupMemberPermissionEnum) as string[]).includes(permissionName)) {
      Logger.warning(`Invalid permission name given: ${permissionName}`, LogTagEnum.Command);
      context.reply(`Неверное название права. Введите /help ${this.getName()} для получения справки`);

      return false;
    }

    const isTakingPermissionsToGiveOrTakePermissions = ([
      GroupMemberPermissionEnum.CommandGivePermission,
      GroupMemberPermissionEnum.CommandTakePermission,
    ] as string[]).includes(permissionName);
    // You cannot take permissions that you don't have, unless you have All permission
    // You cannot take permissions to give or take permissions, unless you have All permission
    // You cannot take All permission
    if (
      (
        !user.permissions.includes(permissionName as GroupMemberPermission)
        || isTakingPermissionsToGiveOrTakePermissions
      ) && !user.permissions.includes(GroupMemberPermissionEnum.All)
      || permissionName === GroupMemberPermissionEnum.All
    ) {
      Logger.warning(
        `User ${context.message.from_id} (group ${context.groupId}) has no permission to take permission ${permissionName}`,
        LogTagEnum.Command,
      );
      context.reply('У вас недостаточно прав для снятия данного права');

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
    if (numericUserId === context.message.from_id) {
      Logger.warning(`User ${numericUserId} tried to take from himself permission ${permissionName}`, LogTagEnum.Command);
      context.reply('Вы не можете снять у себя право');

      return false;
    }

    const takenUser = group.members.find((member) => member.user_id === numericUserId);
    if (!takenUser) {
      Logger.warning(`User ${numericUserId} not found in group ${group.id}`, LogTagEnum.Command);
      context.reply('У пользователя нет прав');

      return false;
    }

    takenUser.permissions = takenUser.permissions.filter((permission) => permission !== permissionName as GroupMemberPermission);
    if (takenUser.permissions.length) {
      group.members = group.members.map((member) => (member.user_id === numericUserId ? takenUser : member));
    } else {
      group.members = group.members.filter((member) => member.user_id !== numericUserId);
    }

    const groupsDataTable = (new GroupsData()).getTable();
    groupsDataTable.update(group);

    const userMention = getUserTap(numericUserId, `${userInfo.first_name} ${userInfo.last_name}`);
    context.reply(`Право ${permissionName} снято у ${userMention}`);
    Logger.info(`Permission ${permissionName} taken from user ${numericUserId} (group ${group.id})`, LogTagEnum.Command);

    return true;
  }

  getArguments(): CommandArgumentDto[] {
    const user = new CommandArgumentDto();
    user.position = 1;
    user.is_optional = false;
    user.is_long = false;
    user.description = 'Идентификатор пользователя';
    user.alias = 'идентификатор';

    const permission = new CommandArgumentDto();
    permission.position = 2;
    permission.is_optional = false;
    permission.is_long = false;
    permission.description = 'Название права';
    permission.alias = 'право';

    return [user, permission];
  }

  getCommandType(): CommandType {
    return CommandTypeEnum.Chat;
  }

  getDescription(): string {
    return 'Отбирает право у пользователя.';
  }

  getGroupMemberPermissions(): GroupMemberPermission[] {
    return [GroupMemberPermissionEnum.CommandTakePermission];
  }

  getGroupPermissions(): GroupPermission[] {
    return [GroupPermissionEnum.ChatCommands];
  }

  getName(): string {
    return 'takepermission';
  }

  getUsage(): string {
    return '/takepermission id permission_name\n/takepermission 275849233 all';
  }
}

export default GivePermissionCommand;
