import BaseExceptionHandler from '@/exceptions/handlers/base-exception-handler';
import VkBotPollingException from '@/exceptions/custom-exceptions/vk-bot-polling-exception';

class VkBotPollingExceptionHandler extends BaseExceptionHandler {
  handle(err: VkBotPollingException): void {
    console.log(err, 3456);
  }
}

export default VkBotPollingExceptionHandler;
