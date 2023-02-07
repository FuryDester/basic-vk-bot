import type { HandlerEvent } from '@/types';
import { HandlerEventEnum } from '@/enums';

function onNewMessage(_ctx: VkBotContext): boolean {
  return true;
}

function onEditMessage(_ctx: VkBotContext): boolean {
  return true;
}

function onDeleteMessage(_ctx: VkBotContext): boolean {
  return true;
}

export default (ctx: VkBotContext, action: HandlerEvent): boolean => {
  switch (action) {
    case HandlerEventEnum.MessageNew: {
      return onNewMessage(ctx);
    }
    case HandlerEventEnum.MessageEdit: {
      return onEditMessage(ctx);
    }
    case HandlerEventEnum.MessageDelete: {
      return onDeleteMessage(ctx);
    }
    default: { return false; }
  }
};
