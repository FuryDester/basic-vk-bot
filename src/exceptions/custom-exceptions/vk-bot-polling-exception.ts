import BaseException from '@/exceptions/custom-exceptions/base-exception';

class VkBotPollingException extends BaseException {
  protected getName(): string {
    return VkBotPollingException.name;
  }

  getOptionsKeys(): Record<string, boolean> {
    return {
      id   : true,
      data : false,
    };
  }
}

export default VkBotPollingException;
