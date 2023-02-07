import type { HandlerEvent } from '@/types';
import { HandlerEventEnum } from '@/enums';

function onReplyMessage(_ctx: VkBotContext): boolean {
  return true;
}

function onEditMessage(_ctx: VkBotContext): boolean {
  return true;
}

export default (ctx: VkBotContext, action: HandlerEvent): boolean => {
  switch (action) {
    case HandlerEventEnum.MessageReply: {
      return onReplyMessage(ctx);
    }
    case HandlerEventEnum.MessageEdit: {
      return onEditMessage(ctx);
    }
    default: { return false; }
  }
};
