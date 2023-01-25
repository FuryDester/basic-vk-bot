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
import VkClient from '@/wrappers/vk-client';
import VkBotPollingException from '@/exceptions/custom-exceptions/vk-bot-polling-exception';
import Listeners from '@/events/listeners';
import * as process from 'process';

let clients = [];
databaseClient.afterAvailability(() => {
  Logger.info('Starting up...');

  const groupsData = (new GroupsData()).getTable();
  groupsData.find().forEach((group: GroupDto & object & LokiObj) => {
    Logger.info(`Group: ${group.id} (${group.name}) found`);

    const client = new VkClient(group.id, group.token, false);
    Listeners.forEach((listener) => {
      // Registering event handlers
      client.event(listener.getEventName(), (ctx, next) => {
        listener.handle(ctx, next);
      });
    });
    Logger.info(`Group: ${group.id} (${group.name}) registered events: ${Object.keys(Listeners).join(', ')}`);

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

  if (!clients.length) {
    Logger.warning('No groups found. Exiting...');
    process.exit(0);
  }

  Logger.info(`Started. Groups registered: ${clients.length}`);
});

// Exit events
let onExitCalled = false;
const onExit = () => {
  if (!onExitCalled) {
    onExitCalled = true;

    Logger.info('Stopping...');

    databaseClient.close();

    clients.forEach((client: VkClient) => {
      client.stop();
    });
  }
};
process.on('exit', () => {
  onExit();
});

process.on('SIGINT', () => {
  onExit();
  process.exit(0);
});

process.on('SIGUSR1', () => {
  onExit();
  process.exit(0);
});
process.on('SIGUSR2', () => {
  onExit();
  process.exit(0);
});
