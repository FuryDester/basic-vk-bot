import BaseException from '@/exceptions/custom-exceptions/base-exception';

class DatabaseNotAvailableException extends BaseException {
  getOptionsKeys(): Record<string, boolean> {
    return {
      databaseName: true,
    };
  }
}

export default DatabaseNotAvailableException;
