import BaseListener from '@/events/base-listener';
import MessageNewEventListener from '@/events/message-new-event-listener';
import MessageEditEventListener from '@/events/message-edit-event-listener';
import MessageReplyEventListener from '@/events/message-reply-event-listener';

export default [
  new MessageNewEventListener(),
  new MessageEditEventListener(),
  new MessageReplyEventListener(),
] as BaseListener[];