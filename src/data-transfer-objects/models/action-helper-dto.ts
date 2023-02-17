import Lokiable from '@/data-transfer-objects/lokiable';
import type { ActionHelperKey } from '@/types';

class ActionHelperDto extends Lokiable {
  group_id: number;

  created_at: number;

  updated_at: number;

  key: ActionHelperKey;

  value: unknown;
}

export default ActionHelperDto;
