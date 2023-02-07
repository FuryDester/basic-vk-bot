import { clients } from '@/index';
import Logger from '@/wrappers/logger';
import { LogTagEnum } from '@/enums';
import VkClient from '@/wrappers/vk-client';

export default (groupId: number, userId: number): boolean => {
  const usedClient = clients.find((client) => client.groupId === groupId) as VkClient;
  if (!usedClient) {
    Logger.error(`Client for group ${groupId} not found (sendUnmuteMessage)`, LogTagEnum.System);

    return false;
  }

  try {
    usedClient.sendMessage(userId, 'Время вашего мута истекло. Вы можете продолжить общение в чате.');

    return true;
  } catch (e) {
    Logger.warning(`Error while sending unmute message to user ${userId} in group ${groupId} (sendUnmuteMessage)`, LogTagEnum.System);

    return false;
  }
};
