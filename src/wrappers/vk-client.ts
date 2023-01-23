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

  startPolling(onError?: (err: any) => void): VkClient {
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
}
