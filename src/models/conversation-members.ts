import BaseModel from '@/models/base-model';
import ConversationMemberDto from '@/data-transfer-objects/models/conversation-member-dto';

class ConversationMembers extends BaseModel {
  protected getDto(): ConversationMemberDto {
    return new ConversationMemberDto();
  }

  protected getTableName(): string {
    return 'conversation_members';
  }

  protected getTableOptions(): Record<string, unknown> | undefined {
    return undefined;
  }

}

export default ConversationMembers;
