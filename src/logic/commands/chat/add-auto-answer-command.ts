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

class AddAutoAnswerCommand extends BaseCommand {
  async execute(
    context: VkBotContext,
    group: GroupDto,
    user: GroupMemberDto,
    args: CommandArgumentDto[],
    _additionalInfo?: unknown,
  ): Promise<boolean> {
    const questions = args.find((item) => item.position === 2)?.argumentValue;
    if (!questions || !questions.trim()) {
      context.reply('Не указаны триггеры');
      Logger.warning(`No triggers supplied! Group id: ${group.id}`, LogTagEnum.Command);

      return false;
    }

    const parsedQuestions = questions.trim().toLowerCase().split('|').map((item) => item.trim());

    const priority = args.find((item) => item.position === 1).argumentValue;
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

    const autoAnswersTable = (new AutoAnswers()).getTable();
    const autoAnswerDto = new AutoAnswerDto();
    autoAnswerDto.answer = context.message?.reply_message?.text || null;
    autoAnswerDto.priority = Number.parseInt(priority, 10);
    autoAnswerDto.questions = parsedQuestions;
    autoAnswerDto.group_id = group.id;
    autoAnswerDto.special_event_id = specialEvent as AnswerSpecialEvent || null;

    autoAnswersTable.insert(autoAnswerDto);

    context.reply('Шаблон добавлен!');
    Logger.info(`New template added. Group id: ${group.id}`, LogTagEnum.Command);

    return true;
  }

  getArguments(): CommandArgumentDto[] {
    const argPriority = new CommandArgumentDto();
    argPriority.position = 1;
    argPriority.is_long = false;
    argPriority.is_optional = false;
    argPriority.alias = 'приоритет';
    argPriority.description = 'Приоритет выполнения';

    const argQuestions = new CommandArgumentDto();
    argQuestions.position = 2;
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

    return [argPriority, argQuestions, argSpecialEvent];
  }

  getCommandType(): CommandType {
    return CommandTypeEnum.Chat;
  }

  getDescription(): string {
    return 'Добавление нового автоматического ответа';
  }

  getGroupMemberPermissions(): GroupMemberPermission[] {
    return [GroupMemberPermissionEnum.CommandAddAutoAnswer];
  }

  getGroupPermissions(): GroupPermission[] {
    return [GroupPermissionEnum.AutoAnswers];
  }

  getName(): string {
    return 'addautoanswer';
  }

  getUsage(): string {
    let result = '/addautoanswer <приоритет> <ответы> <спецсобытие> + пересланное сообщение\n';
    result += '/addautoanswer 1 привет|здравствуйте';

    return result;
  }
}

export default AddAutoAnswerCommand;
