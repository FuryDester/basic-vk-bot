import AutoAnswers from '@/models/auto-answers';
import AutoAnswerDto from '@/data-transfer-objects/models/auto-answer-dto';
import Logger from '@/wrappers/logger';
import { LogTagEnum } from '@/enums';
import BaseSpecialEvent from '@/logic/helpers/chat/answer-special-event/base-special-event';
import NotifyTechEvent from '@/logic/helpers/chat/answer-special-event/notify-tech-event';

const SPECIAL_EVENTS: BaseSpecialEvent[] = [
  new NotifyTechEvent(),
];

export default async (ctx: VkBotContext): Promise<boolean> => {
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

  const event = SPECIAL_EVENTS.find((item) => item.getSpecialEventCode() === answerDto.special_event_id);
  if (!event) {
    Logger.critical(`No handler for special event ${answerDto.special_event_id}, group id: ${ctx.groupId}`, LogTagEnum.System);

    return false;
  }

  if (await event.handle(ctx)) {
    Logger.info(`Special event finished successfully. Special event: ${answerDto.special_event_id} (group ${ctx.groupId})`, LogTagEnum.System);
  } else {
    Logger.error(
      `Special event exited with false code. Special event: ${answerDto.special_event_id}, ctx: ${JSON.stringify(ctx)}`,
      LogTagEnum.System,
    );
  }

  return true;
};
