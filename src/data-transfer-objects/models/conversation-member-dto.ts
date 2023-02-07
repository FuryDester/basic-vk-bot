import WarnDto from '@/data-transfer-objects/misc/warn-dto';
import MuteDto from '@/data-transfer-objects/misc/mute-dto';
import Lokiable from '@/data-transfer-objects/lokiable';

class ConversationMemberDto extends Lokiable {
  group_id: number;

  user_id: number;

  is_admin: boolean;

  conversation_id: number;

  warns: WarnDto[];

  mutes: MuteDto[];

  last_mute?: MuteDto;

  warns_removed: number;
}

export default ConversationMemberDto;
