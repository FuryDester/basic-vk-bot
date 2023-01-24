import Logger from '@/wrappers/logger';

abstract class BaseListener {
  protected next: () => unknown;

  protected beforeHandle(data: VkBotContext): void {
    Logger.info(`Event ${this.constructor.name} received. Data: ${JSON.stringify(data)}`);
  }

  handle(data: VkBotContext, next?: () => unknown): void {
    this.next = next;

    this.beforeHandle(data);

    this.handleEvent(data);

    if (this.next) {
      this.next();
    }
  }

  protected abstract handleEvent(data: VkBotContext): void;
}

export default BaseListener;
