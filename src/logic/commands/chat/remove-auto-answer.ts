import BaseCommand from '@/logic/commands/base-command';
import type { CommandType, GroupMemberPermission, GroupPermission } from '@/types';
import CommandArgumentDto from '@/data-transfer-objects/misc/command-argument-dto';
import GroupDto from '@/data-transfer-objects/models/group-dto';
import GroupMemberDto from '@/data-transfer-objects/models/group-member-dto';
import { CommandTypeEnum, GroupMemberPermissionEnum, GroupPermissionEnum, LogTagEnum } from '@/enums';
import Logger from '@/wrappers/logger';
import AutoAnswers from '@/models/auto-answers';

class RemoveAutoAnswer extends BaseCommand {
  async execute(
    context: VkBotContext,
    group: GroupDto,
    user: GroupMemberDto,
    args: CommandArgumentDto[],
    _additionalInfo?: unknown,
  ): Promise<boolean> {
    const id = Number.parseInt(args.find((item) => item.position === 1)?.argumentValue, 10);
    if (!id) {
      context.reply('Не введён идентификатор шаблона');
      Logger.warning(`No template id supplied. Group id: ${group.id}`, LogTagEnum.Command);

      return false;
    }

    const autoAnswersTable = (new AutoAnswers()).getTable();
    if (!autoAnswersTable.get(id)) {
      context.reply('Не найден шаблон с таким идентификатором');
      Logger.warning(`Wrong template id supplied. Group id: ${group.id}`, LogTagEnum.Command);

      return false;
    }

    autoAnswersTable.remove(id);

    context.reply('Шаблон удалён!');
    Logger.info(`Template removed from group ${group.id}`, LogTagEnum.Command);

    return true;
  }

  getArguments(): CommandArgumentDto[] {
    const argId = new CommandArgumentDto();
    argId.position = 1;
    argId.is_long = false;
    argId.is_optional = false;
    argId.alias = 'идентификатор';
    argId.description = 'Идентификатор шаблона';

    return [argId];
  }

  getCommandType(): CommandType {
    return CommandTypeEnum.Chat;
  }

  getDescription(): string {
    return 'Удаление автоматического ответа';
  }

  getGroupMemberPermissions(): GroupMemberPermission[] {
    return [GroupMemberPermissionEnum.CommandRemoveAutoAnswer];
  }

  getGroupPermissions(): GroupPermission[] {
    return [GroupPermissionEnum.AutoAnswers];
  }

  getName(): string {
    return 'removeautoanswer';
  }

  getUsage(): string {
    return '/removeautoanswer <идентификатор>';
  }
}

export default RemoveAutoAnswer;
