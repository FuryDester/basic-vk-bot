import BaseException from '@/exceptions/custom-exceptions/base-exception';

class VkBotPollingException extends BaseException {
  getOptionsKeys(): Record<string, boolean> {
    return {
      id   : true,
      data : false,
    };
  }
}

export default VkBotPollingException;
