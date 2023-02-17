import BaseException from '@/exceptions/custom-exceptions/base-exception';

class VkBotApiException extends BaseException {
  getOptionsKeys(): Record<string, boolean> {
    return {
      method : true,
      params : true,
    };
  }
}

export default VkBotApiException;
