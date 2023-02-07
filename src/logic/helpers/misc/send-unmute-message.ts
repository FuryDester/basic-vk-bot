import { clients } from '@/index';
import Logger from '@/wrappers/logger';
import { LogTagEnum } from '@/enums';
import VkClient from '@/wrappers/vk-client';
import getUserTap from '@/logic/helpers/misc/get-user-tap';

export default async (groupId: number, userId: number, conversationId: number): Promise<boolean> => {
  const usedClient = clients.find((client) => client.groupId === groupId) as VkClient;
  if (!usedClient) {
    Logger.error(`Client for group ${groupId} not found (sendUnmuteMessage)`, LogTagEnum.System);

    return false;
  }

  try {
    await usedClient.sendMessage(userId, 'Время вашего мута истекло. Вы можете продолжить общение в чате.');

    return true;
  } catch (e) {
    Logger.warning(`Error while sending unmute message to user ${userId} in group ${groupId} (sendUnmuteMessage)`, LogTagEnum.System);
    const userInfo = await usedClient.getUserInfo(userId);
    const userMention = getUserTap(userId, `${userInfo.first_name} ${userInfo.last_name}`);

    try {
      await usedClient.sendMessage(conversationId, `${userMention}, время вашего мута истекло. Вы можете продолжить общение в чате.`);
    } catch {
      Logger.error(`Error while sending unmute message to conversation ${conversationId} in group ${groupId} (sendUnmuteMessage)`, LogTagEnum.System);

      return false;
    }

    return true;
  }
};
