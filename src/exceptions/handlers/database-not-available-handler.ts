import BaseExceptionHandler from '@/exceptions/handlers/base-exception-handler';
import DatabaseNotAvailableException from '@/exceptions/custom-exceptions/database-not-available-exception';
import Logger from '@/wrappers/logger';

class DatabaseNotAvailableExceptionHandler extends BaseExceptionHandler {
  handle(err: DatabaseNotAvailableException): void {
    Logger.error(`DatabaseNotAvailableHandler: ${err.message}, database name: ${err.getOptions().databaseName}`);
  }
}

export default DatabaseNotAvailableExceptionHandler;
