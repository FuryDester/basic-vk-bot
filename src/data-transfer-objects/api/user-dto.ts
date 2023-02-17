import BaseDto from '@/data-transfer-objects/base-dto';

class UserDto implements BaseDto {
  id: number;

  first_name: string;

  last_name: string;
}

export default UserDto;
