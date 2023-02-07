import VkClient from '@/wrappers/vk-client';
import { clients } from '@/index';
import Logger from '@/wrappers/logger';

export default (groupId: number): VkClient | null => {
  const usedClient = clients.find((client) => client.groupId === groupId) as VkClient;
  if (!usedClient) {
    Logger.error(`Client for group ${groupId} not found.`);

    return null;
  }

  return usedClient;
};
