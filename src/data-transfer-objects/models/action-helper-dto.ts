import Lokiable from '@/data-transfer-objects/lokiable';

class ActionHelperDto extends Lokiable {
  group_id: number;

  created_at: number;

  updated_at: number;

  key: string;

  value: unknown;
}

export default ActionHelperDto;
