import type { AnswerSpecialEvent } from '@/types';

interface BaseSpecialEvent {
  handle(context: VkBotContext): Promise<boolean>;

  getSpecialEventCode(): AnswerSpecialEvent;
}

export default BaseSpecialEvent;
