import type { MessageAction } from '@/types';
import { MessageActionEnum } from '@/enums';

function onNewMessage(_ctx: VkBotContext): boolean {
  return true;
}

function onEditMessage(_ctx: VkBotContext): boolean {
  return true;
}

function onDeleteMessage(_ctx: VkBotContext): boolean {
  return true;
}

export default (ctx: VkBotContext, action: MessageAction): boolean => {
  switch (action) {
    case MessageActionEnum.MessageNew: {
      return onNewMessage(ctx);
    }
    case MessageActionEnum.MessageEdit: {
      return onEditMessage(ctx);
    }
    case MessageActionEnum.MessageDelete: {
      return onDeleteMessage(ctx);
    }
    default: { return false; }
  }
};
