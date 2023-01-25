import BaseException from '@/exceptions/custom-exceptions/base-exception';

class CommandInsufficientArguments extends BaseException {
  getOptionsKeys(): Record<string, boolean> {
    return {
      argument: true,
    };
  }
}

export default CommandInsufficientArguments;
