import AutoAnswers from '@/models/auto-answers';
import AutoAnswerDto from '@/data-transfer-objects/models/auto-answer-dto';
import Logger from '@/wrappers/logger';
import { LogTagEnum } from '@/enums';

export default (ctx: VkBotContext): boolean => {
  const message = ctx.message.text.toLowerCase().trim();
  if (!message) {
    Logger.warning(`Empty message received in process user question. Group id: ${ctx.groupId}`, LogTagEnum.System);
    return false;
  }

  const autoAnswersModel = new AutoAnswers();
  const autoAnswersTable = autoAnswersModel.getTable();

  // FIXME: Limit does not work for some reason
  const answer = autoAnswersTable
    .chain()
    .sort((a: AutoAnswerDto, b: AutoAnswerDto) => a.priority - b.priority)
    .find({
      group_id  : ctx.groupId,
      questions : {
        $contains: message,
      },
    } as object)
    .data()[0];

  if (!answer) {
    return true;
  }

  const answerDto = autoAnswersModel.formDto(answer) as AutoAnswerDto;
  if (!answerDto.answer && !answerDto.special_event_id) {
    Logger.error(`No answer and special_event_id set for answer. Answer id: ${answer.$loki}`, LogTagEnum.System);

    return false;
  }

  if (answerDto.priority <= 0) {
    Logger.info(`Template is disabled in group ${ctx.groupId}, answer id: ${answer.$loki}`, LogTagEnum.System);
    return true;
  }

  if (!answerDto.special_event_id) {
    ctx.reply(answerDto.answer);
    Logger.info(`Answered in group ${ctx.groupId} with answer id: ${answer.$loki}`, LogTagEnum.System);

    return true;
  }

  // TODO: Special events

  return true;
};
