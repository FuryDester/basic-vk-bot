import BaseDto from '@/data-transfer-objects/base-dto';

class Lokiable implements BaseDto {
  $loki: number;

  meta: { created: number; revision: number; updated: number; version: number; };
}

export default Lokiable;
