import BaseCommand from '@/logic/commands/base-command';
import type { AnswerSpecialEvent, CommandType, GroupMemberPermission, GroupPermission } from '@/types';
import CommandArgumentDto from '@/data-transfer-objects/misc/command-argument-dto';
import GroupDto from '@/data-transfer-objects/models/group-dto';
import GroupMemberDto from '@/data-transfer-objects/models/group-member-dto';
import {
  AnswerSpecialEventEnum,
  CommandTypeEnum,
  GroupMemberPermissionEnum,
  GroupPermissionEnum,
  LogTagEnum,
} from '@/enums';
import Logger from '@/wrappers/logger';
import AutoAnswers from '@/models/auto-answers';
import AutoAnswerDto from '@/data-transfer-objects/models/auto-answer-dto';

class EditAutoAnswerCommand extends BaseCommand {
  async execute(
    context: VkBotContext,
    group: GroupDto,
    user: GroupMemberDto,
    args: CommandArgumentDto[],
    _additionalInfo?: unknown,
  ): Promise<boolean> {
    const specialEvent = args.find((item) => item.position === 3)?.argumentValue?.trim();
    if (specialEvent && !Object.values(AnswerSpecialEventEnum).includes(specialEvent as unknown as AnswerSpecialEventEnum)) {
      context.reply('Неправильное специальное событие. Смотри: /help getallspecialevents');
      Logger.warning(`Invalid special event given. Group: ${group.id}`, LogTagEnum.Command);

      return false;
    }

    if ((!context.message.reply_message || !context.message.reply_message.text) && !specialEvent) {
      context.reply('Вы должны ответить на сообщение, которое будет записано в базу');
      Logger.warning(`No reply message supplied! Group id: ${group.id}`, LogTagEnum.Command);

      return false;
    }

    const questions = args.find((item) => item.position === 3)?.argumentValue;
    if (!questions || !questions.trim()) {
      context.reply('Не указаны триггеры');
      Logger.warning(`No triggers supplied! Group id: ${group.id}`, LogTagEnum.Command);

      return false;
    }

    const id = Number.parseInt(args.find((item) => item.position === 1)?.argumentValue, 10);
    if (Number.isNaN(id)) {
      context.reply('Не указан идентификатор');
      Logger.warning(`No template id given. Group: ${group.id}`, LogTagEnum.Command);

      return false;
    }

    const autoAnswersModel = new AutoAnswers();
    const autoAnswersTable = autoAnswersModel.getTable();
    const autoAnswer = autoAnswersTable.get(id);
    if (!autoAnswer) {
      context.reply('Неправильный идентификатор шаблона. Смотри /help getautoanswers');
      Logger.warning(`Invalid template id given. Group: ${group.id}`, LogTagEnum.Command);

      return false;
    }

    const answerDto = autoAnswersModel.formDto(autoAnswer) as AutoAnswerDto;
    const parsedQuestions = questions.trim().toLowerCase().split('|').map((item) => item.trim());
    const priority = Number.parseInt(args.find((item) => item.position === 2)?.argumentValue, 10);
    if (Number.isNaN(priority)) {
      context.reply('Не задан приоритет шаблона');
      Logger.warning(`No priority given. Group id: ${group.id}`, LogTagEnum.Command);

      return false;
    }

    answerDto.answer = context.message?.reply_message?.text || null;
    answerDto.questions = parsedQuestions;
    answerDto.priority = priority;
    answerDto.special_event_id = specialEvent as AnswerSpecialEvent || null;
    autoAnswersTable.update(answerDto);

    context.reply('Шаблон изменён!');
    Logger.info(`Template changed. Group id: ${group.id}, id: ${answerDto.$loki}`, LogTagEnum.Command);

    return true;
  }

  getArguments(): CommandArgumentDto[] {
    const argId = new CommandArgumentDto();
    argId.position = 1;
    argId.is_long = false;
    argId.is_optional = false;
    argId.alias = 'идентификатор';
    argId.description = 'Идентификатор шаблона';

    const argPriority = new CommandArgumentDto();
    argPriority.position = 2;
    argPriority.is_long = false;
    argPriority.is_optional = false;
    argPriority.alias = 'приоритет';
    argPriority.description = 'Приоритет выполнения';

    const argQuestions = new CommandArgumentDto();
    argQuestions.position = 3;
    argQuestions.is_long = true;
    argQuestions.is_optional = false;
    argQuestions.alias = 'вопросы';
    argQuestions.description = 'Триггеры, разделённые через |';

    const argSpecialEvent = new CommandArgumentDto();
    argSpecialEvent.position = 3;
    argSpecialEvent.is_long = false;
    argSpecialEvent.is_optional = true;
    argSpecialEvent.alias = 'спецсобытие';
    argSpecialEvent.description = 'Специальное событие при вызове шаблона';

    return [argId, argPriority, argQuestions, argSpecialEvent];
  }

  getCommandType(): CommandType {
    return CommandTypeEnum.Chat;
  }

  getDescription(): string {
    return 'Обновление нового автоматического ответа';
  }

  getGroupMemberPermissions(): GroupMemberPermission[] {
    return [GroupMemberPermissionEnum.CommandEditAutoAnswer];
  }

  getGroupPermissions(): GroupPermission[] {
    return [GroupPermissionEnum.AutoAnswers];
  }

  getName(): string {
    return 'editautoanswer';
  }

  getUsage(): string {
    let result = '/editautoanswer <идентификатор> <приоритет> <ответы> + пересланное сообщение\n';
    result += '/editautoanswer 2 1 привет|здравствуйте';

    return result;
  }
}

export default EditAutoAnswerCommand;
