import BaseListener from '@/events/base-listener';
import MessageNewEventListener from '@/events/message-new-event-listener';

export default [new MessageNewEventListener()] as BaseListener[];