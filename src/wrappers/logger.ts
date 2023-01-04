import { databaseClient } from '@/wrappers/database-client';
import type { LogLevel, LogChannel } from '@/types';
import { LogLevelEnum, LogChannelEnum } from '@/enums';
import DatabaseNotAvailableException from '@/exceptions/custom-exceptions/database-not-available-exception';
import moment from 'moment';

class Logger {
  private static instance: Logger;

  public static getInstance(): Logger {
    if (!Logger.instance) {
      Logger.instance = new Logger();
    }

    return Logger.instance;
  }

  public debug(message: string, channel: LogChannel = LogChannelEnum.All): void {
    this.log(LogLevelEnum.Debug, message, channel);
  }

  public info(message: string, channel: LogChannel = LogChannelEnum.All): void {
    this.log(LogLevelEnum.Info, message, channel);
  }

  public notice(message: string, channel: LogChannel = LogChannelEnum.All): void {
    this.log(LogLevelEnum.Notice, message, channel);
  }

  public warning(message: string, channel: LogChannel = LogChannelEnum.All): void {
    this.log(LogLevelEnum.Warning, message, channel);
  }

  public error(message: string, channel: LogChannel = LogChannelEnum.All): void {
    this.log(LogLevelEnum.Error, message, channel);
  }

  public critical(message: string, channel: LogChannel = LogChannelEnum.All): void {
    this.log(LogLevelEnum.Critical, message, channel);
  }

  public alert(message: string, channel: LogChannel = LogChannelEnum.All): void {
    this.log(LogLevelEnum.Alert, message, channel);
  }

  public emergency(message: string, channel: LogChannel = LogChannelEnum.All): void {
    this.log(LogLevelEnum.Emergency, message, channel);
  }

  public log(level: LogLevel, message: string, channel: LogChannel = LogChannelEnum.All): void {

  }

  private logToConsole(level: LogLevel, message: string): void {
    console.log(`[${moment().format('DD.MM.YYYY HH:mm:ss')}] [${level}] ${message}`);
  }

  private logToFilesystem(level: LogLevel, message: string): void {
    
  }
}

export default Logger;
