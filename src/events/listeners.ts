import BaseListener from '@/events/base-listener';
import MessageNewEventListener from '@/events/message-new-event-listener';

export default {
  message_new: new MessageNewEventListener(),
} as Record<string, BaseListener>;