import BaseException from '@/exceptions/custom-exceptions/base-exception';

class DatabaseNotAvailableException extends BaseException {
  protected getName(): string {
    return DatabaseNotAvailableException.name;
  }

  getOptionsKeys(): Record<string, boolean> {
    return {
      databaseName: true,
    };
  }
}

export default DatabaseNotAvailableException;
