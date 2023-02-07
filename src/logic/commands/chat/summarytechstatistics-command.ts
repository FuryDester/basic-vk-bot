import BaseCommand from '@/logic/commands/base-command';
import GroupDto from '@/data-transfer-objects/models/group-dto';
import type { CommandType, GroupMemberPermission, GroupPermission } from '@/types';
import CommandArgumentDto from '@/data-transfer-objects/misc/command-argument-dto';
import GroupMemberDto from '@/data-transfer-objects/models/group-member-dto';
import { CommandTypeEnum, GroupMemberPermissionEnum, GroupPermissionEnum } from '@/enums';
import getTechStatistics from '@/logic/helpers/chat/get-tech-statistics';
import * as moment from 'moment';
import Logger from '@/wrappers/logger';
import getClientByGroupId from '@/logic/helpers/misc/get-client-by-group-id';
import getUserTap from '@/logic/helpers/misc/get-user-tap';

class TechstatisticsCommand extends BaseCommand {
  async execute(
    context: VkBotContext,
    group: GroupDto,
    user: GroupMemberDto,
    args: CommandArgumentDto[],
    _additionalInfo?: unknown,
  ): Promise<boolean> {
    let argPeriodFrom = args.find((arg) => arg.position === 1)?.argumentValue;
    let argPeriodTo = args.find((arg) => arg.position === 2)?.argumentValue;
    if (!argPeriodFrom) {
      argPeriodFrom = '01.01.1970';
    }

    if (!argPeriodTo) {
      argPeriodTo = moment().format('DD.MM.YYYY');
    }
    const periodFrom = moment(argPeriodFrom, 'DD.MM.YYYY').startOf('day').unix() * 1000;
    const periodTo = moment(argPeriodTo, 'DD.MM.YYYY').endOf('day').unix() * 1000;

    const statisticUsers = group.members.filter((member) =>
      member.permissions.includes(GroupMemberPermissionEnum.CountTechStatistics)
      || member.permissions.includes(GroupMemberPermissionEnum.All),
    );
    if (!statisticUsers.length) {
      context.reply('В группе нет пользователей, ответы которых можно считать.');
      Logger.info(`Group ${group.id} has no users with CountTechStatistics permission.`);

      return true;
    }

    const usedClient = getClientByGroupId(group.id);
    if (!usedClient) {
      context.reply('Внутренняя ошибка');
    }

    let finalString = 'Суммарная статистика об ответах технической поддержи:\n\n';
    for (const statisticUser of statisticUsers) {
      const userInfo = await usedClient.getUserInfo(statisticUser.user_id);
      const userMention = getUserTap(statisticUser.user_id, `${userInfo.first_name} ${userInfo.last_name}`);

      finalString += `${userMention}:\n`;
      finalString += getTechStatistics(group.id, statisticUser.user_id, periodFrom, periodTo) + '\n\n';
    }

    context.reply(finalString);

    return true;
  }

  getArguments(): CommandArgumentDto[] {
    const periodFrom = new CommandArgumentDto();
    periodFrom.isLong = false;
    periodFrom.isOptional = true;
    periodFrom.alias = 'дата_с';
    periodFrom.description = 'Дата начала периода, за который нужно получить статистику.';
    periodFrom.position = 1;

    const periodTo = new CommandArgumentDto();
    periodTo.isLong = false;
    periodTo.isOptional = true;
    periodTo.alias = 'дата_по';
    periodTo.description = 'Дата конца периода, за который нужно получить статистику.';
    periodTo.position = 2;

    return [periodFrom, periodTo];
  }

  getCommandType(): CommandType {
    return CommandTypeEnum.Chat;
  }

  getDescription(): string {
    return 'Выводит информацию о статистике ответов сотрудников техподдержки.';
  }

  getGroupMemberPermissions(): GroupMemberPermission[] {
    return [GroupMemberPermissionEnum.CountTechStatistics, GroupMemberPermissionEnum.CommandSummaryTechStatistics];
  }

  getGroupPermissions(): GroupPermission[] {
    return [GroupPermissionEnum.ChatCommands, GroupPermissionEnum.TechStatistics];
  }

  getName(): string {
    return 'summarytechstatistics';
  }

  getUsage(): string {
    let finalString = '/summarytechstatistics [дата с] [дата по]\n';
    finalString += '/summarytechstatistics 01.01.2023 01.02.2023\n';
    finalString += '/summarytechstatistics 01.01.2023\n';
    finalString += '/summarytechstatistics';

    return finalString;
  }
}

export default TechstatisticsCommand;
