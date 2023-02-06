import VkBot from 'node-vk-bot-api';
import UserDto from '@/data-transfer-objects/api/user-dto';
import VkBotApiException from '@/exceptions/custom-exceptions/vk-bot-api-exception';

class VkClient {
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
    message: string | object,
    attachment?: string | string[],
    keyboard?: VkBotKeyboard,
    sticker?: string | number,
  ): Promise<{ peer_id: number, message_id: number, conversation_message_id: number, error?: any }> {
    const finalMessage = message;
    if (typeof finalMessage === 'object') {
      Object.assign(finalMessage, {
        random_id: Math.floor(Math.random() * 1000000),
      });
    }

    return this.getBotInstance().sendMessage(
      userId as number | string,
      finalMessage as unknown as string,
      attachment,
      keyboard,
      sticker,
    );
  }

  deleteMessage(
    peerId: number | string,
    messageIds?: number | string | number[] | string[],
    conversationMessageIds?: number | string | number[] | string[],
  ): Promise <unknown> {
    return this.getBotInstance().execute('messages.delete', {
      message_ids    : Array.isArray(messageIds) ? messageIds.join(',') : messageIds,
      delete_for_all : 1,
      peer_id        : peerId,
      cmids          : Array.isArray(conversationMessageIds) ? conversationMessageIds.join(',') : conversationMessageIds,
    });
  }

  event(triggers: string, ...middlewares: VkBotMiddleware[]): VkClient {
    this.getBotInstance().event(triggers, ...middlewares);

    return this;
  }

  execute(method: string, params: Record<string, unknown>): Promise<Record<string, unknown>> {
    return this.getBotInstance().execute(method, params);
  }

  async getUsersInfo(userIds: number[]): Promise<UserDto[]> {
    const method = 'users.get';
    const params = {
      user_ids: userIds.join(','),
    };

    try {
      const result = await this.execute(method, params);

      return (result as unknown as UserDto[]).map((item) => {
        const userDto = new UserDto();
        Object.assign(userDto, item);

        return userDto;
      });
    } catch (e) {
      throw new VkBotApiException(e.message, { method, params });
    }
  }

  async getUserInfo(userId: number): Promise<UserDto> {
    return (await this.getUsersInfo([userId]))[0];
  }

  static isConversationMessage(ctx: VkBotContext): boolean {
    return ctx.message.peer_id !== ctx.message.from_id;
  }
}

export default VkClient;
