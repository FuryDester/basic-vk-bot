import BaseDto from '@/data-transfer-objects/base-dto';

class MuteDto implements BaseDto {
  reason: string;

  message_id: number;

  given_at: number;

  given_by: number;

  expires_at: number;
}

export default MuteDto;
