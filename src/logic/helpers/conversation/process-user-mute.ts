import ConversationMembers from '@/models/conversation-members';
import ConversationMemberDto from '@/data-transfer-objects/models/conversation-member-dto';

export default (ctx: VkBotContext): boolean => {
  const conversationMemberModel = new ConversationMembers();
  const conversationMemberTable = conversationMemberModel.getTable();

  const conversationUser = conversationMemberTable.findOne({
    group_id        : ctx.groupId,
    user_id         : ctx.message.from_id,
    conversation_id : ctx.message.peer_id,
  } as object);

  if (!conversationUser) {
    return false;
  }

  const userDto = conversationMemberModel.formDto(conversationUser) as ConversationMemberDto;
  if (!userDto.lastMute) {
    return false;
  }

  if (userDto.lastMute)
};
