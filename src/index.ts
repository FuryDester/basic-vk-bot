import 'module-alias/register';

import { config } from 'dotenv';
import { resolve } from 'path';
config({ path: resolve(__dirname, '../.env') });

import '@/exceptions/handler';

// TODO: Make event handler?
import { databaseClient } from '@/wrappers/database-client';
import GroupsData from '@/models/groups-data';
import Logger from '@/wrappers/logger';
import { LogChannelEnum } from '@/enums';
import GroupDto from '@/data-transfer-objects/group-dto';
import { VkClient } from '@/wrappers/vk-client';
import VkBotPollingException from '@/exceptions/custom-exceptions/vk-bot-polling-exception';

Logger.info('Starting up...', LogChannelEnum.Console);

const groupsData = (new GroupsData()).getTable();
let clients = [];
groupsData.find().forEach((group: GroupDto & object & LokiObj) => {
  Logger.info(`Group: ${group.id} (${group.name}) found`, LogChannelEnum.Console);

  const client = new VkClient(group.id, group.token, false);

  client.startPolling((err: any) => {
    if (err) {
      throw new VkBotPollingException('Error while startPolling on start script', {
        id   : group.id,
        data : err,
      });
    }
  });
  clients.push(client);
});

process.on('exit', () => {
  databaseClient.close();

  clients.forEach((client: VkClient) => {
    client.stop();
  });
});
