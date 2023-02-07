import BaseCommand from '@/logic/commands/base-command';
import CommandArgumentDto from '@/data-transfer-objects/misc/command-argument-dto';
import type { CommandType, GroupMemberPermission, GroupPermission } from '@/types';
import { CommandTypeEnum, GroupMemberPermissionEnum, GroupPermissionEnum } from '@/enums';
import GroupDto from '@/data-transfer-objects/models/group-dto';
import GroupMemberDto from '@/data-transfer-objects/models/group-member-dto';
import Logger from '@/wrappers/logger';

class GetAllPermissionsCommand extends BaseCommand {
  getArguments(): CommandArgumentDto[] {
    return [];
  }

  getCommandType(): CommandType {
    return CommandTypeEnum.Chat;
  }

  getDescription(): string {
    return 'Получение всех существующих прав';
  }

  getGroupMemberPermissions(): GroupMemberPermission[] {
    return [GroupMemberPermissionEnum.CommandGetAllPermissions];
  }

  getGroupPermissions(): GroupPermission[] {
    return [GroupPermissionEnum.ChatCommands];
  }

  getName(): string {
    return 'getallpermissions';
  }

  getUsage(): string {
    return 'При использовании команды выводит все существующие права.';
  }

  async execute(
    context: VkBotContext,
    _group: GroupDto,
    _user: GroupMemberDto,
    _args: CommandArgumentDto[],
    _additionalInfo: unknown,
  ): Promise<boolean> {
    let finalMessage = `Список всех существующих прав пользователя:\n\n${Object.values(GroupMemberPermissionEnum).join(', ')}`;
    finalMessage += `\n\nСписок всех существующих прав группы:\n\n${Object.values(GroupPermissionEnum).join(', ')}\n\n`;
    finalMessage += 'За подробной информацией обращайтесь к разработчику.';

    context.reply(finalMessage);

    return true;
  }
}

export default GetAllPermissionsCommand;
