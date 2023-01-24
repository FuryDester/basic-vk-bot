import {
  LogLevelEnum,
  LogChannelEnum,
  GroupPermissionEnum,
  CommandTypeEnum,
} from '@/enums';

export type LogLevel = `${LogLevelEnum}`;

export type LogChannel = `${LogChannelEnum}`;

export type GroupPermission = `${GroupPermissionEnum}`;

export type CommandType = `${CommandTypeEnum}`;
