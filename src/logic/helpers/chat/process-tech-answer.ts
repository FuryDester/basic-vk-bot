import type { HandlerEvent } from '@/types';
import { HandlerEventEnum, LogTagEnum } from '@/enums';
import TechAnswerDto from '@/data-transfer-objects/models/tech-answer-dto';
import StatisticsCollector from '@/wrappers/statistics-collector';
import TechAnswers from '@/models/tech-answers';
import Logger from '@/wrappers/logger';

function createNewTechAnswer(ctx: VkBotContext, editCount: number = 0): TechAnswerDto {
  const techAnswersTable = (new TechAnswers()).getTable();

  const techAnswerDto = new TechAnswerDto();
  techAnswerDto.group_id = ctx.groupId;
  techAnswerDto.message_id = ctx.message.id;
  techAnswerDto.chat_id = ctx.message.peer_id;
  techAnswerDto.user_id = ctx.message.from_id;
  techAnswerDto.text_length = ctx.message.text.trim().length;
  techAnswerDto.edit_count = editCount;
  techAnswerDto.answered_at = Date.now();

  return techAnswersTable.insert(techAnswerDto) as TechAnswerDto;
}

function onReplyMessage(ctx: VkBotContext): boolean {
  StatisticsCollector.addTechNewMessage();

  createNewTechAnswer(ctx);

  return true;
}

function onEditMessage(ctx: VkBotContext): boolean {
  const TechAnswersModel = new TechAnswers();
  const TechAnswersTable = TechAnswersModel.getTable();

  const answer = TechAnswersTable.findOne({
    group_id   : ctx.groupId,
    message_id : ctx.message.id,
  } as object);
  if (!answer) {
    Logger.warning(`Tech answer not found for message ${ctx.message.id}, group id: ${ctx.groupId} (message_edit)`, LogTagEnum.Handler);

    createNewTechAnswer(ctx, 1);
  } else {
    const techAnswerDto = TechAnswersModel.formDto(answer) as TechAnswerDto;
    techAnswerDto.edit_count += 1;
    techAnswerDto.text_length = ctx.message.text.trim().length;

    TechAnswersTable.update(techAnswerDto);
  }

  return true;
}

export default (ctx: VkBotContext, action: HandlerEvent): boolean => {
  switch (action) {
    case HandlerEventEnum.MessageReply: {
      return onReplyMessage(ctx);
    }
    case HandlerEventEnum.MessageEdit: {
      return onEditMessage(ctx);
    }
    default: { return false; }
  }
};
