import BaseModel from '@/models/base-model';
import TechAnswerDto from '@/data-transfer-objects/models/tech-answer-dto';

class TechAnswers extends BaseModel {
  protected getDto(): TechAnswerDto {
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
