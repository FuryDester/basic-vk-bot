import BaseCommand from '@/logic/commands/base-command';
import GroupDto from '@/data-transfer-objects/models/group-dto';
import type { CommandType, GroupMemberPermission, GroupPermission } from '@/types';
import CommandArgumentDto from '@/data-transfer-objects/misc/command-argument-dto';
import GroupMemberDto from '@/data-transfer-objects/models/group-member-dto';
import { CommandTypeEnum, GroupMemberPermissionEnum, GroupPermissionEnum } from '@/enums';
import getTechStatistics from '@/logic/helpers/chat/get-tech-statistics';
import * as moment from 'moment';

class TechstatisticsCommand extends BaseCommand {
  async execute(
    context: VkBotContext,
    group: GroupDto,
    user: GroupMemberDto,
    _args: CommandArgumentDto[],
    _additionalInfo?: unknown,
  ): Promise<boolean> {
    // Form statistics for 1 month
    const periodFrom = moment().startOf('month').unix() * 1000;
    const periodTo = moment().endOf('month').unix() * 1000;

    context.reply(getTechStatistics(group.id, user.user_id, periodFrom, periodTo));

    return true;
  }

  getArguments(): CommandArgumentDto[] {
    return [];
  }

  getCommandType(): CommandType {
    return CommandTypeEnum.Chat;
  }

  getDescription(): string {
    return 'Выводит информацию о статистике Ваших ответов.';
  }

  getGroupMemberPermissions(): GroupMemberPermission[] {
    return [GroupMemberPermissionEnum.CountTechStatistics];
  }

  getGroupPermissions(): GroupPermission[] {
    return [GroupPermissionEnum.ChatCommands, GroupPermissionEnum.TechStatistics];
  }

  getName(): string {
    return 'techstatistics';
  }

  getUsage(): string {
    return '';
  }
}

export default TechstatisticsCommand;
