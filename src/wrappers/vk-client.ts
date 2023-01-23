import VkBot from 'node-vk-bot-api';

export class VkClient {
  private bot: VkBot;

  private groupId: number;

  constructor(groupId: number, token: string, startPolling: boolean = true, onError?: (err: any) => {}) {
    this.groupId = groupId;
    this.bot = new VkBot(token);

    if (startPolling) {
      this.bot.startPolling(onError);
    }
  }

  getBotInstance(): VkBot {
    return this.bot;
  }

  setBotInstance(bot: VkBot): VkClient {
    this.bot = bot;

    return this;
  }

  startPolling(onError?: (err: any) => {}): VkClient {
    this.getBotInstance().startPolling(onError);

    return this;
  }

  getGroupId(): number {
    return this.groupId;
  }

  setGroupId(groupId: number): VkClient {
    this.groupId = groupId;

    return this;
  }

  stop(): VkClient {
    this.getBotInstance().stop();

    return this;
  }

  on(...middlewares: VkBotMiddleware[]): VkClient {
    this.getBotInstance().on(...middlewares);

    return this;
  }

  sendMessage(
    userId: string | number | string[] | number[],
    message: string,
    attachment?: string | string[],
    keyboard?: VkBotKeyboard,
    sticker?: string | number,
  ): Promise<{ peer_id: number, message_id: number, conversation_message_id: number, error?: any }> {
    return this.getBotInstance().sendMessage(
      userId as number | string,
      message,
      attachment,
      keyboard,
      sticker,
    );
  }

  event(triggers: string, ...middlewares: VkBotMiddleware[]): VkClient {
    this.getBotInstance().event(triggers, ...middlewares);

    return this;
  }

  execute(method: string, params: Record<string, unknown>): Promise<Record<string, unknown>> {
    return this.getBotInstance().execute(method, params);
  }
}
