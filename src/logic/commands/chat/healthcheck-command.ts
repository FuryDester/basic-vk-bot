import BaseCommand from '@/logic/commands/base-command';
import CommandArgumentDto from '@/data-transfer-objects/misc/command-argument-dto';
import type { CommandType, GroupMemberPermission, GroupPermission } from '@/types';
import { CommandTypeEnum } from '@/enums';
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
    let answerString = 'Статистические данные бота:\n';
    answerString += `Время запуска: ${moment(StatisticsCollector.getStartTime()).format('DD.MM.YYYY HH:mm:ss')}\n`;
    answerString += `Исключения: ${StatisticsCollector.getExceptions()}\n`;
    answerString += `Записей в логах с момента старта: ${StatisticsCollector.getLogs()}\n`;

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
