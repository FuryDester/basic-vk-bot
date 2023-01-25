export enum LogChannelEnum {
  Database = 'Database',
  Filesystem = 'Filesystem',
  Console = 'Console',
  All = 'All',
}

export enum LogLevelEnum {
  Debug = 'debug',
  Info = 'info',
  Notice = 'notice',
  Warning = 'warning',
  Error = 'error',
  Critical = 'critical',
  Alert = 'alert',
  Emergency = 'emergency',
}

export enum LogTagEnum {
  Command = 'command',
  System = 'system',
  Handler = 'handler',
}

export enum GroupPermissionEnum {
  All = 'all',
}

export enum GroupMemberPermissionEnum {
  All = 'all',
}

export enum CommandTypeEnum {
  Conversation = 'conversation',
  Chat = 'chat',
}

export enum HandlerEventEnum {
  MessageNew = 'message_new',
}
