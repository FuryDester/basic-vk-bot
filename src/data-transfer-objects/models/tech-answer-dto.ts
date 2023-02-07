import Lokiable from '@/data-transfer-objects/lokiable';

class TechAnswerDto extends Lokiable {
  group_id: number;

  chat_id: number;

  user_id: number;

  text_length: number;

  answered_at: number;

  message_id: number;

  edit_count: number;
}

export default TechAnswerDto;
