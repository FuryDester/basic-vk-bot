import type { LogTag, LogLevel } from '@/types';

class LogDto {
  level: LogLevel;

  message: string;

  tag: LogTag;
}

export default LogDto;
