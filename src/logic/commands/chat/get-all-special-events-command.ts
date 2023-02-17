import BaseCommand from '@/logic/commands/base-command';
import CommandArgumentDto from '@/data-transfer-objects/misc/command-argument-dto';
import type { CommandType, GroupMemberPermission, GroupPermission } from '@/types';
import { AnswerSpecialEventEnum, CommandTypeEnum, GroupMemberPermissionEnum, GroupPermissionEnum } from '@/enums';
import GroupDto from '@/data-transfer-objects/models/group-dto';
import GroupMemberDto from '@/data-transfer-objects/models/group-member-dto';

class GetAllSpecialEventsCommand extends BaseCommand {
  getArguments(): CommandArgumentDto[] {
    return [];
  }

  getCommandType(): CommandType {
    return CommandTypeEnum.Chat;
  }

  getDescription(): string {
    return 'Получение всех существующих событий шаблонов';
  }

  getGroupMemberPermissions(): GroupMemberPermission[] {
    return [GroupMemberPermissionEnum.CommandGetAllSpecialEvents];
  }

  getGroupPermissions(): GroupPermission[] {
    return [GroupPermissionEnum.ChatCommands];
  }

  getName(): string {
    return 'getallspecialevents';
  }

  getUsage(): string {
    return 'При использовании команды выводит все специальные события для шаблонов';
  }

  async execute(
    context: VkBotContext,
    _group: GroupDto,
    _user: GroupMemberDto,
    _args: CommandArgumentDto[],
    _additionalInfo: unknown,
  ): Promise<boolean> {
    let finalMessage = `Список всех существующих специальных событий:\n\n${Object.values(AnswerSpecialEventEnum).join(', ')}\n`;
    finalMessage += 'За подробной информацией обращайтесь к разработчику.';

    context.reply(finalMessage);

    return true;
  }
}

export default GetAllSpecialEventsCommand;
