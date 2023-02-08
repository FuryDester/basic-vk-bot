import Lokiable from '@/data-transfer-objects/lokiable';

class MailUserDto extends Lokiable {
  group_id: number;

  user_id: number;

  messages_opened: boolean;

  added_at: number;

  messages_force_disabled: boolean;

  last_mail_received_at: number;
}

export default MailUserDto;
