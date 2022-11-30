import 'module-alias/register';

import { config } from 'dotenv';
import { resolve } from 'path';
config({ path: resolve(__dirname, '../.env') });

import '@/exceptions/handler';

// TODO: Make event handler?
import { databaseClient } from '@/wrappers/database-client';

process.on('exit', () => {
  databaseClient.close();
});
