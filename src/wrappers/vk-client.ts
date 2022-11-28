import VkBot from 'node-vk-bot-api';

export class VkClient {
  private bot: VkBot;

  private groupId: number;

  constructor(groupId: number, token: string, startPolling: boolean = true) {
    this.groupId = groupId;
    this.bot = new VkBot(token);

    if (startPolling) {
      this.bot.startPolling();
    }
  }

  getBotInstance(): VkBot {
    return this.bot;
  }

  setBotInstance(bot: VkBot): VkClient {
    this.bot = bot;

    return this;
  }

  getGroupId(): number {
    return this.groupId;
  }

  setGroupId(groupId: number): VkClient {
    this.groupId = groupId;

    return this;
  }
}
