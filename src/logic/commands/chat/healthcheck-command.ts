import BaseCommand from '@/logic/commands/base-command';
import CommandArgumentDto from '@/data-transfer-objects/misc/command-argument-dto';
import type { CommandType, GroupMemberPermission, GroupPermission } from '@/types';
import { CommandTypeEnum, GroupMemberPermissionEnum, GroupPermissionEnum } from '@/enums';
import GroupDto from '@/data-transfer-objects/models/group-dto';
import GroupMemberDto from '@/data-transfer-objects/models/group-member-dto';
import * as moment from 'moment';
import StatisticsCollector from '@/wrappers/statistics-collector';

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
    return [GroupMemberPermissionEnum.CommandHealthcheck];
  }

  getGroupPermissions(): GroupPermission[] {
    return [GroupPermissionEnum.ChatCommands];
  }

  getName(): string {
    return 'healthcheck';
  }

  getUsage(): string {
    return 'При использовании команды выводит сообщение о статусе работоспособности бота.';
  }

  async execute(
    context: VkBotContext,
    group: GroupDto,
    user: GroupMemberDto,
    _args: CommandArgumentDto[],
    _additionalInfo: unknown,
  ): Promise<boolean> {
    let answerString = 'Статистические данные бота:\n';
    answerString += `Время запуска: ${moment(StatisticsCollector.getStartTime()).format('DD.MM.YYYY HH:mm:ss')}\n`;
    answerString += `Исключения: ${StatisticsCollector.getExceptions()}\n`;
    answerString += `Записей в логах с момента старта: ${StatisticsCollector.getLogs()}\n`;
    answerString += `Группа: ${group.name} (${group.id})\n`;
    answerString += `Пользователь: ${user.user_id}\n`;
    answerString += `Команд выполнено: ${StatisticsCollector.getCommandsExecuted()}\n`;
    answerString += `Команд провалено: ${StatisticsCollector.getCommandsFailed()}\n`;
    answerString += `Удалено замученных сообщений: ${StatisticsCollector.getMutedMessagesDeleted()}\n`;
    answerString += `Новых ответов техподдержки: ${StatisticsCollector.getTechNewMessages()}\n`;

    const events = StatisticsCollector.getEventsRegistered();
    if (events) {
      answerString += 'Полученные события:\n';

      for (const [eventName, count] of Object.entries(events)) {
        answerString += ` * ${eventName}: ${count}\n`;
      }
    }

    context.reply(answerString);

    return true;
  }
}

export default HealthcheckCommand;
