import BaseModel from '@/models/base-model';
import AutoAnswerDto from '@/data-transfer-objects/models/auto-answer-dto';

class AutoAnswers extends BaseModel {
  protected getDto(): AutoAnswerDto {
    return new AutoAnswerDto();
  }

  protected getTableName(): string {
    return 'auto_answers';
  }

  protected getTableOptions(): Record<string, unknown> | undefined {
    return undefined;
  }
}

export default AutoAnswers;
