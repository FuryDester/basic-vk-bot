import BaseDto from '@/data-transfer-objects/base-dto';

class WarnDto implements BaseDto {
  reason: string;

  message_id: number;

  given_at: number;

  given_by: number;
}

export default WarnDto;
