import BaseDto from '@/data-transfer-objects/base-dto';

class CommandArgumentDto implements BaseDto {
  position: number;

  // Is argument long (more than one word)
  isLong: boolean;

  isOptional: boolean;

  alias: string;

  description: string | undefined;

  argumentValue: string | undefined;
}

export default CommandArgumentDto;
