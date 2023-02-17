import type { LogTag, LogLevel } from '@/types';
import BaseDto from '@/data-transfer-objects/base-dto';

class LogDto implements BaseDto {
  level: LogLevel;

  message: string;

  tag: LogTag;
}

export default LogDto;
