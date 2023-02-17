import Lokiable from '@/data-transfer-objects/lokiable';
import type { AnswerSpecialEvent } from '@/types';

class AutoAnswerDto extends Lokiable {
  group_id: number;

  special_event_id?: AnswerSpecialEvent;

  answer?: string;

  questions: string[];

  priority: number;
}

export default AutoAnswerDto;
