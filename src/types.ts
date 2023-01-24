import {
  LogLevelEnum,
  LogChannelEnum,
  GroupPermissionEnum,
  GroupMemberPermissionEnum,
  CommandTypeEnum,
} from '@/enums';

export type LogLevel = `${LogLevelEnum}`;

export type LogChannel = `${LogChannelEnum}`;

export type GroupPermission = `${GroupPermissionEnum}`;

export type GroupMemberPermission = `${GroupMemberPermissionEnum}`;

export type CommandType = `${CommandTypeEnum}`;
