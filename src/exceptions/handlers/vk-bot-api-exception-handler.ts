import BaseExceptionHandler from '@/exceptions/handlers/base-exception-handler';
import BaseException from '@/exceptions/custom-exceptions/base-exception';
import Logger from '@/wrappers/logger';

class VkBotApiExceptionHandler extends BaseExceptionHandler {
  handle(exception: BaseException): void {
    Logger.error(
      `VkBotApiExceptionHandler: ${
        exception.message
      }, method: ${
        exception.getOptions().method
      }, params: ${
        JSON.stringify(exception.getOptions().params)
      }`,
    );
  }
}

export default VkBotApiExceptionHandler;
