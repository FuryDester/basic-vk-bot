import Lokiable from '@/data-transfer-objects/lokiable';

class AutoAnswerDto extends Lokiable {
  group_id: number;

  special_event_id?: string;

  answer: string;

  questions: string[];

  priority: number;
}

export default AutoAnswerDto;
