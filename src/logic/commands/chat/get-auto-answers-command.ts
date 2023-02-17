import BaseCommand from '@/logic/commands/base-command';
import type { CommandType, GroupMemberPermission, GroupPermission } from '@/types';
import CommandArgumentDto from '@/data-transfer-objects/misc/command-argument-dto';
import GroupDto from '@/data-transfer-objects/models/group-dto';
import GroupMemberDto from '@/data-transfer-objects/models/group-member-dto';
import { CommandTypeEnum, GroupMemberPermissionEnum, GroupPermissionEnum, LogTagEnum } from '@/enums';
import Logger from '@/wrappers/logger';
import PastebinAPI from 'pastebin-ts';
import AutoAnswerDto from '@/data-transfer-objects/models/auto-answer-dto';
import * as moment from 'moment';
import AutoAnswers from '@/models/auto-answers';

class GetAutoAnswersCommand extends BaseCommand {
  async execute(
    context: VkBotContext,
    group: GroupDto,
    _user: GroupMemberDto,
    _args: CommandArgumentDto[],
    _additionalInfo?: unknown,
  ): Promise<boolean> {
    if (!group.pastebin_token) {
      context.reply('Не установлен токен pastebin. Смотри: /help setpastebin');
      Logger.warning(`No pastebin token supplied! Group id: ${group.id}`, LogTagEnum.Command);
    }

    const pastebin = new PastebinAPI({
      api_dev_key: group.pastebin_token,
    });

    const autoAnswersModel = new AutoAnswers();
    const autoAnswersTable = autoAnswersModel.getTable();

    const answers = autoAnswersTable.find({
      group_id: group.id,
    } as object);
    if (!answers.length) {
      context.reply('В данной группе не установлены шаблоны');
      Logger.info(`No templates set in group ${group.id}`);

      return true;
    }

    const answerDtos = autoAnswersModel.formDtos(answers) as AutoAnswerDto[];
    try {
      const result = await pastebin.createPaste({
        text       : this.formOutputString(answerDtos),
        privacy    : 1,
        title      : `Templates ${moment().format('DD.MM.YYYY HH:mm:ss')} (group ${group.id})`,
        expiration : '1H',
      });

      context.reply(`Доступные шаблоны доступны по ссылке в течение часа:\n${result}`);
      Logger.info(`Template list generated for group ${group.id}`, LogTagEnum.Command);

      return true;
    } catch (e) {
      context.reply(`Сервер вернул ошибку, повторите попытку позже: ${e.message}`);
      Logger.warning(`Pastebin returned error: ${e.message} (group id: ${group.id})`);

      return false;
    }
  }

  private formOutputString(data: AutoAnswerDto[]): string {
    return data.map((item) => {
      let result = `ID: ${item.$loki}\n`;
      result += `Group ID: ${item.group_id}\n`;
      result += `Special Code: ${item.special_event_id || 'No special code'}\n`;
      result += `Triggers: ${item.questions.join(', ')}\n`;
      result += `Answer:\n${item.answer}`;

      return result;
    }).join('\n\n');
  }

  getArguments(): CommandArgumentDto[] {
    return [];
  }

  getCommandType(): CommandType {
    return CommandTypeEnum.Chat;
  }

  getDescription(): string {
    return 'Получение информации о текущих шаблонах';
  }

  getGroupMemberPermissions(): GroupMemberPermission[] {
    return [GroupMemberPermissionEnum.CommandGetAutoAnswers];
  }

  getGroupPermissions(): GroupPermission[] {
    return [GroupPermissionEnum.AutoAnswers];
  }

  getName(): string {
    return 'getautoanswers';
  }

  getUsage(): string {
    return '/getautoanswers';
  }
}

export default GetAutoAnswersCommand;
