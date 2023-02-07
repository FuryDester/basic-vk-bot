import BaseModel from '@/models/base-model';
import Lokiable from '@/data-transfer-objects/lokiable';
import BaseDto from '@/data-transfer-objects/base-dto';
import TechAnswerDto from '@/data-transfer-objects/models/tech-answer-dto';

class TechAnswers extends BaseModel {
  protected getDto(): (BaseDto & object) | (Lokiable & object) {
    return new TechAnswerDto();
  }

  protected getTableName(): string {
    return 'tech_answers';
  }

  protected getTableOptions(): Record<string, unknown> | undefined {
    return undefined;
  }
}

export default TechAnswers;
