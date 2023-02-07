import * as moment from 'moment';
import TechAnswers from '@/models/tech-answers';
import TechAnswerDto from '@/data-transfer-objects/models/tech-answer-dto';

export default (groupId: number, userId: number, periodFrom: number, periodTo: number): string => {
  const dateFrom = moment(periodFrom).format('DD.MM.YYYY');
  const dateTo = moment(periodTo).format('DD.MM.YYYY');

  const techAnswersModel = new TechAnswers();
  const techAnswersTable = techAnswersModel.getTable();

  const data = techAnswersModel.formDtos(techAnswersTable.find({
    group_id    : groupId,
    user_id     : userId,
    answered_at : {
      $gte : periodFrom,
      $lte : periodTo,
    },
  } as object)) as TechAnswerDto[];

  if (!data.length) {
    return `За период с ${dateFrom} по ${dateTo} статистика не найдена.`;
  }

  const totalMessages = data.length;
  const dialogsCount = data.map((item) => item.chat_id);
  const averageMessageLength = data.reduce((acc, item) => acc + item.text_length, 0) / totalMessages;
  const averageEditCount = data.reduce((acc, item) => acc + item.edit_count, 0) / totalMessages;

  let finalString = `За период с ${dateFrom} по ${dateTo} было написано ${totalMessages} сообщений в ${dialogsCount.length} разных диалогах.\n`;
  finalString += `Средняя длина сообщения составляет ${averageMessageLength.toFixed(2)} символов.\n`;
  finalString += `Среднее количество редактирований сообщения составляет ${averageEditCount.toFixed(2)}.`;

  return finalString;
};
