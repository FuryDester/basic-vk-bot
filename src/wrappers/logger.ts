import type { LogLevel, LogChannel, LogTag } from '@/types';
import { LogLevelEnum, LogChannelEnum, LogTagEnum } from '@/enums';
import DatabaseNotAvailableException from '@/exceptions/custom-exceptions/database-not-available-exception';
import * as moment from 'moment';
import { appendFileSync, writeFileSync, existsSync } from 'fs';
import * as path from 'path';
import LogDto from '@/data-transfer-objects/misc/log-dto';
import Logs from '@/models/logs';

class Logger {
  public static debug(message: string, tag: LogTag = LogTagEnum.System, channel: LogChannel = LogChannelEnum.All): void {
    this.log(LogLevelEnum.Debug, message, tag, channel);
  }

  public static info(message: string, tag: LogTag = LogTagEnum.System, channel: LogChannel = LogChannelEnum.All): void {
    this.log(LogLevelEnum.Info, message, tag, channel);
  }

  public static notice(message: string, tag: LogTag = LogTagEnum.System, channel: LogChannel = LogChannelEnum.All): void {
    this.log(LogLevelEnum.Notice, message, tag, channel);
  }

  public static warning(message: string, tag: LogTag = LogTagEnum.System, channel: LogChannel = LogChannelEnum.All): void {
    this.log(LogLevelEnum.Warning, message, tag, channel);
  }

  public static error(message: string, tag: LogTag = LogTagEnum.System, channel: LogChannel = LogChannelEnum.All): void {
    this.log(LogLevelEnum.Error, message, tag, channel);
  }

  public static critical(message: string, tag: LogTag = LogTagEnum.System, channel: LogChannel = LogChannelEnum.All): void {
    this.log(LogLevelEnum.Critical, message, tag, channel);
  }

  public static alert(message: string, tag: LogTag = LogTagEnum.System, channel: LogChannel = LogChannelEnum.All): void {
    this.log(LogLevelEnum.Alert, message, tag, channel);
  }

  public static emergency(message: string, tag: LogTag = LogTagEnum.System, channel: LogChannel = LogChannelEnum.All): void {
    this.log(LogLevelEnum.Emergency, message, tag, channel);
  }

  public static log(level: LogLevel, message: string, tag: LogTag = LogTagEnum.System, channel: LogChannel = LogChannelEnum.All): void {
    if (channel === LogChannelEnum.All || channel === LogChannelEnum.Console) {
      this.logToConsole(level, tag, message);
    }

    if (channel === LogChannelEnum.All || channel === LogChannelEnum.Filesystem) {
      this.logToFilesystem(level, tag, message);
    }

    if (channel === LogChannelEnum.All || channel === LogChannelEnum.Database) {
      this.logToDatabase(level, tag, message);
    }
  }

  private static logToConsole(level: LogLevel, tag: LogTag, message: string): void {
    console.log(`[${moment().format('DD.MM.YYYY HH:mm:ss')}] [${level.toUpperCase()}] [${tag.toUpperCase()}] ${message}`);
  }

  private static logToFilesystem(level: LogLevel, tag: LogTag, message: string): void {
    try {
      const currentMoment = moment();
      const logPath = path.resolve(__dirname, `../../logs/${currentMoment.format('YYYY-MM-DD')}.log`);

      if (!existsSync(logPath)) {
        writeFileSync(logPath, '');
      }

      appendFileSync(logPath, `[${currentMoment.format('HH:mm:ss')}] [${level.toUpperCase()}] [${tag.toUpperCase()}] ${message}\n`);
    } catch (err) {
      this.logToConsole(LogLevelEnum.Error, tag, `Failed to log to filesystem: ${err.message}`);
      this.logToConsole(LogLevelEnum.Error, tag, `Original level: ${level}, original message: ${message}`);
    }
  }

  private static logToDatabase(level: LogLevel, tag: LogTag, message: string): void {
    try {
      const log = new LogDto();
      Object.assign(log, {
        level,
        tag,
        message,
      });

      (new Logs()).getTable().insertOne(log);
    } catch (err) {
      if (err instanceof DatabaseNotAvailableException) {
        this.logToFilesystem(level, tag, message);
      } else {
        this.logToFilesystem(LogLevelEnum.Error, tag, `Failed to log to database: ${err.message}`);
        this.logToFilesystem(LogLevelEnum.Error, tag, `Original level: ${level}, original message: ${message}`);
      }
    }
  }
}

export default Logger;
