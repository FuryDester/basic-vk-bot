import BaseException from '@/exceptions/custom-exceptions/base-exception';

class VkBotPollingException extends BaseException {
  getName(): string {
    return VkBotPollingException.name;
  }
}

export default VkBotPollingException;
