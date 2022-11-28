import 'module-alias/register';

import { config } from 'dotenv';
import { resolve } from 'path';
config({ path: resolve(__dirname, '../.env') });

import { databaseClient } from '@/wrappers/database-client';

console.log(databaseClient);
