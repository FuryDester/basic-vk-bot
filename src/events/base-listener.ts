import Logger from '@/wrappers/logger';

abstract class BaseListener {
  beforeHandle(data: unknown): void {
    Logger.info(`Event ${this.constructor.name} received. Data: ${JSON.stringify(data)}`);
  }

  handle(data: unknown): void {
    this.beforeHandle(data);

    this.handleEvent(data);
  }

  protected abstract handleEvent(data: unknown): void;
}

export default BaseListener;
