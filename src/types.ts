import {
  LogLevelEnum,
  LogChannelEnum,
  GroupPermissionEnum,
  GroupMemberEnum,
  CommandTypeEnum,
} from '@/enums';

export type LogLevel = `${LogLevelEnum}`;

export type LogChannel = `${LogChannelEnum}`;

export type GroupPermission = `${GroupPermissionEnum}`;

export type GroupMember = `${GroupMemberEnum}`;

export type CommandType = `${CommandTypeEnum}`;
