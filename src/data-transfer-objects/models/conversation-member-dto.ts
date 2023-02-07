import WarnDto from '@/data-transfer-objects/misc/warn-dto';
import MuteDto from '@/data-transfer-objects/misc/mute-dto';
import Lokiable from '@/data-transfer-objects/lokiable';
import KickDto from '@/data-transfer-objects/misc/kick-dto';

class ConversationMemberDto extends Lokiable {
  group_id: number;

  user_id: number;

  is_admin: boolean;

  conversation_id: number;

  warns: WarnDto[];

  mutes: MuteDto[];

  last_mute?: MuteDto;

  warns_removed: number;

  kicks: KickDto[];
}

export default ConversationMemberDto;
