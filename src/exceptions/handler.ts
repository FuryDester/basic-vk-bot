import VkBotPollingException from '@/exceptions/custom-exceptions/vk-bot-polling-exception';
import VkBotPollingExceptionHandler from '@/exceptions/handlers/vk-bot-polling-exception-handler';
import BaseException from '@/exceptions/custom-exceptions/base-exception';
import Logger from '@/wrappers/logger';
import DatabaseNotAvailableException from '@/exceptions/custom-exceptions/database-not-available-exception';
import DatabaseNotAvailableExceptionHandler from '@/exceptions/handlers/database-not-available-handler';
import * as process from 'process';
import StatisticsCollector from '@/wrappers/statistics-collector';
import VkBotApiException from '@/exceptions/custom-exceptions/vk-bot-api-exception';

const exceptionHandlers = [
  [VkBotPollingException, VkBotPollingExceptionHandler],
  [DatabaseNotAvailableException, DatabaseNotAvailableExceptionHandler],
  [VkBotApiException, VkBotPollingExceptionHandler],
];

process.on('uncaughtException', (error: Error) => {
  StatisticsCollector.addException();

  let foundHandler = false;
  if (error instanceof BaseException) {
    exceptionHandlers.forEach((item) => {
      if (error instanceof item[0]) {
        new item[1](error as unknown as BaseException & string);
        foundHandler = true;
      }
    });
  }

  if (!foundHandler) {
    Logger.emergency(`Unhandled error: ${error.stack}, api message: ${(error as unknown as Record<string, unknown>).error_msg || ''}`);
    process.exit(1);
  }
});
