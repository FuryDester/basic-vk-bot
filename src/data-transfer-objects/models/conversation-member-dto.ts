import BaseDto from '@/data-transfer-objects/base-dto';
import WarnDto from '@/data-transfer-objects/misc/warn-dto';

class ConversationMemberDto implements BaseDto {
  group_id: number;

  user_id: number;

  is_admin: boolean;

  conversation_id: number;

  warns: WarnDto[];
}

export default ConversationMemberDto;
