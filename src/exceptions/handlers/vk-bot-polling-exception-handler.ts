import BaseExceptionHandler from '@/exceptions/handlers/base-exception-handler';
import VkBotPollingException from '@/exceptions/custom-exceptions/vk-bot-polling-exception';
import Logger from '@/wrappers/logger';

class VkBotPollingExceptionHandler extends BaseExceptionHandler {
  handle(err: VkBotPollingException): void {
    Logger.error(`VkBotPollingException: ${err.message}, group id: ${err.getOptions().id}, data: ${err.getOptions().data}`);
  }
}

export default VkBotPollingExceptionHandler;
