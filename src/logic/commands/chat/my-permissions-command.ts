import BaseCommand from '@/logic/commands/base-command';
import CommandArgumentDto from '@/data-transfer-objects/misc/command-argument-dto';
import type { CommandType, GroupMemberPermission, GroupPermission } from '@/types';
import { CommandTypeEnum, GroupMemberPermissionEnum, GroupPermissionEnum } from '@/enums';
import GroupDto from '@/data-transfer-objects/models/group-dto';
import GroupMemberDto from '@/data-transfer-objects/models/group-member-dto';
import Logger from '@/wrappers/logger';

class MyPermissionsCommand extends BaseCommand {
  getArguments(): CommandArgumentDto[] {
    return [];
  }

  getCommandType(): CommandType {
    return CommandTypeEnum.Chat;
  }

  getDescription(): string {
    return 'Проверка работоспособности бота';
  }

  getGroupMemberPermissions(): GroupMemberPermission[] {
    return [GroupMemberPermissionEnum.CommandMyPermissions];
  }

  getGroupPermissions(): GroupPermission[] {
    return [GroupPermissionEnum.ChatCommands];
  }

  getName(): string {
    return 'mypermissions';
  }

  getUsage(): string {
    return 'При использовании команды выводит выданные Вам права.';
  }

  async execute(
    context: VkBotContext,
    group: GroupDto,
    user: GroupMemberDto,
    _args: CommandArgumentDto[],
    _additionalInfo: unknown,
  ): Promise<boolean> {
    if (!user.permissions.length) {
      Logger.warning(`User ${user.user_id} has no permissions in group ${group.id}`);
      context.reply('У Вас нет прав.');

      return false;
    }

    context.reply(`Ваши права: ${user.permissions.join(', ')}.`);

    return true;
  }
}

export default MyPermissionsCommand;
