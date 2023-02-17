import Logger from '@/wrappers/logger';
import { LogTagEnum } from '@/enums';
import type { HandlerEvent } from '@/types';
import StatisticsCollector from '@/wrappers/statistics-collector';

abstract class BaseListener {
  protected next: () => unknown;

  abstract getEventName(): HandlerEvent;

  protected beforeHandle(data: VkBotContext): void {
    Logger.info(`Handler ${this.constructor.name} triggered. Data: ${JSON.stringify(data)}`, LogTagEnum.Handler);

    StatisticsCollector.addNewEvent(this.getEventName());
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
