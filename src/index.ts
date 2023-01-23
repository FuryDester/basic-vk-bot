import 'module-alias/register';

import { config } from 'dotenv';
import { resolve } from 'path';
config({ path: resolve(__dirname, '../.env') });

import '@/exceptions/handler';

// TODO: Make event handler?
import { databaseClient } from '@/wrappers/database-client';
import GroupsData from '@/models/groups-data';
import Logger from '@/wrappers/logger';
import GroupDto from '@/data-transfer-objects/models/group-dto';
import { VkClient } from '@/wrappers/vk-client';
import VkBotPollingException from '@/exceptions/custom-exceptions/vk-bot-polling-exception';
import Listeners from '@/events/listeners';

Logger.info('Starting up...');

const groupsData = (new GroupsData()).getTable();
let clients = [];
groupsData.find().forEach((group: GroupDto & object & LokiObj) => {
  Logger.info(`Group: ${group.id} (${group.name}) found`);

  const client = new VkClient(group.id, group.token, false);
  Object.keys(Listeners).forEach((listenerName: string) => {
    client.event(listenerName, Listeners[listenerName].handle);
  });

  client.startPolling((err: any) => {
    if (err) {
      throw new VkBotPollingException('Error while startPolling on start script', {
        id   : group.id,
        data : err,
      });
    }

    return {};
  });
  clients.push(client);
});

process.on('exit', () => {
  databaseClient.close();

  clients.forEach((client: VkClient) => {
    client.stop();
  });

  Logger.info('Stopping...');
});
