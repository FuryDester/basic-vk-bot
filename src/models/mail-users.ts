import BaseModel from '@/models/base-model';
import MailUserDto from '@/data-transfer-objects/models/mail-user-dto';

class MailUsers extends BaseModel {
  protected getDto(): MailUserDto {
    return new MailUserDto();
  }

  protected getTableName(): string {
    return 'mail_users';
  }

  protected getTableOptions(): Record<string, unknown> | undefined {
    return undefined;
  }
}

export default MailUsers;
