import BaseListener from '@/events/base-listener';

class MessageNewEventListener extends BaseListener {
  handleEvent(data: unknown): void {
    // TODO handle
    console.log(data);
  }
}

export default MessageNewEventListener;
