import BaseCommand from '@/logic/commands/base-command';
import CommandArgumentDto from '@/data-transfer-objects/misc/command-argument-dto';
import type { CommandType, GroupMemberPermission, GroupPermission } from '@/types';
import { CommandTypeEnum } from '@/enums';
import GroupDto from '@/data-transfer-objects/models/group-dto';
import GroupMemberDto from '@/data-transfer-objects/models/group-member-dto';

class HealthcheckCommand extends BaseCommand {
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
    return [];
  }

  getGroupPermissions(): GroupPermission[] {
    return [];
  }

  getName(): string {
    return 'healthcheck';
  }

  getUsage(): string {
    return 'При использовании команды выводит сообщение о статусе работоспособности бота.';
  }

  execute(context: VkBotContext, _group: GroupDto, _user: GroupMemberDto, _args: CommandArgumentDto[], _additionalInfo: unknown): boolean {
    context.reply('Бот работает! // TODO: add more info');

    return true;
  }
}

export default HealthcheckCommand;
