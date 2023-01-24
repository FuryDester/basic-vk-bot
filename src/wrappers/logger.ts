import { databaseClient } from '@/wrappers/database-client';
import type { LogLevel, LogChannel } from '@/types';
import { LogLevelEnum, LogChannelEnum } from '@/enums';
import DatabaseNotAvailableException from '@/exceptions/custom-exceptions/database-not-available-exception';
import * as moment from 'moment';
import { appendFileSync, writeFileSync, existsSync } from 'fs';
import * as path from 'path';

class Logger {
  public static debug(message: string, channel: LogChannel = LogChannelEnum.All): void {
    this.log(LogLevelEnum.Debug, message, channel);
  }

  public static info(message: string, channel: LogChannel = LogChannelEnum.All): void {
    this.log(LogLevelEnum.Info, message, channel);
  }

  public static notice(message: string, channel: LogChannel = LogChannelEnum.All): void {
    this.log(LogLevelEnum.Notice, message, channel);
  }

  public static warning(message: string, channel: LogChannel = LogChannelEnum.All): void {
    this.log(LogLevelEnum.Warning, message, channel);
  }

  public static error(message: string, channel: LogChannel = LogChannelEnum.All): void {
    this.log(LogLevelEnum.Error, message, channel);
  }

  public static critical(message: string, channel: LogChannel = LogChannelEnum.All): void {
    this.log(LogLevelEnum.Critical, message, channel);
  }

  public static alert(message: string, channel: LogChannel = LogChannelEnum.All): void {
    this.log(LogLevelEnum.Alert, message, channel);
  }

  public static emergency(message: string, channel: LogChannel = LogChannelEnum.All): void {
    this.log(LogLevelEnum.Emergency, message, channel);
  }

  public static log(level: LogLevel, message: string, channel: LogChannel = LogChannelEnum.All): void {
    if (channel === LogChannelEnum.All || channel === LogChannelEnum.Console) {
      this.logToConsole(level, message);
    }

    if (channel === LogChannelEnum.All || channel === LogChannelEnum.Filesystem) {
      this.logToFilesystem(level, message);
    }

    if (channel === LogChannelEnum.All || channel === LogChannelEnum.Database) {
      this.logToDatabase(level, message);
    }
  }

  private static logToConsole(level: LogLevel, message: string): void {
    console.log(`[${moment().format('DD.MM.YYYY HH:mm:ss')}] [${level.toUpperCase()}] ${message}`);
  }

  private static logToFilesystem(level: LogLevel, message: string): void {
    try {
      const currentMoment = moment();
      const logPath = path.resolve(__dirname, `../../logs/${currentMoment.format('YYYY-MM-DD')}.log`);

      if (!existsSync(logPath)) {
        writeFileSync(logPath, '');
      }

      appendFileSync(logPath, `[${currentMoment.format('HH:mm:ss')}] [${level.toUpperCase()}] ${message}\n`);
    } catch (err) {
      this.logToConsole(LogLevelEnum.Error, `Failed to log to filesystem: ${err.message}`);
      this.logToConsole(LogLevelEnum.Error, `Original level: ${level}, original message: ${message}`);
    }
  }

  private static logToDatabase(level: LogLevel, message: string): void {
    try {
      databaseClient.getOrAddCollection('logs').insertOne({
        level     : level.toUpperCase(),
        message,
        timestamp : moment().unix(),
      });
    } catch (err) {
      if (err instanceof DatabaseNotAvailableException) {
        this.logToFilesystem(level, message);
      } else {
        this.logToFilesystem(LogLevelEnum.Error, `Failed to log to database: ${err.message}`);
        this.logToFilesystem(LogLevelEnum.Error, `Original level: ${level}, original message: ${message}`);
      }
    }
  }
}

export default Logger;
