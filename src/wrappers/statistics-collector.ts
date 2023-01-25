import type { HandlerEvent } from '@/types';

class StatisticsCollector {
  protected static startTime: Date;

  protected static eventsRegistered: Record<HandlerEvent, number> | {} = {};

  protected static exceptions: number = 0;

  protected static logs: number = 0;

  protected static commandsExecuted: number = 0;

  protected static commandsFailed: number = 0;

  static getStartTime(): Date {
    return this.startTime;
  }

  static setStartTime(startTime: Date): void {
    this.startTime = startTime;
  }

  static addNewEvent(event: HandlerEvent): void {
    if (!this.eventsRegistered[event]) {
      this.eventsRegistered[event] = 0;
    }

    this.eventsRegistered[event]++;
  }

  static getEventsRegistered(): Record<HandlerEvent, number> | {} {
    return this.eventsRegistered;
  }

  static addException(): void {
    this.exceptions++;
  }

  static getExceptions(): number {
    return this.exceptions;
  }

  static addLog(): void {
    this.logs++;
  }

  static getLogs(): number {
    return this.logs;
  }

  static addCommandExecution(): void {
    this.commandsExecuted++;
  }

  static getCommandsExecuted(): number {
    return this.commandsExecuted;
  }

  static addCommandFailure(): void {
    this.commandsFailed++;
  }

  static getCommandsFailed(): number {
    return this.commandsFailed;
  }
}

export default StatisticsCollector;
