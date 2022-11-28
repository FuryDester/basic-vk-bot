import VkBotPollingException from '@/exceptions/custom-exceptions/vk-bot-polling-exception';
import VkBotPollingExceptionHandler from '@/exceptions/handlers/vk-bot-polling-exception-handler';
import BaseException from '@/exceptions/custom-exceptions/base-exception';

const exceptionHandlers = [
  [VkBotPollingException, VkBotPollingExceptionHandler],
];

process.on('uncaughtException', (error: Error) => {
  let foundHandler = false;
  if (error instanceof BaseException) {
    exceptionHandlers.forEach((item) => {
      if (error instanceof item[0]) {
        new item[1](error as BaseException & string);
        foundHandler = true;
      }
    });
  }

  if (!foundHandler) {
    console.log(error);
    process.exit(1);
  }
});
