import GroupDto from '@/data-transfer-objects/models/group-dto';

export default (ctx: VkBotContext, group: GroupDto): boolean => {
  return Boolean(group.members.find((member) => member.user_id === ctx.message.peer_id));
};
