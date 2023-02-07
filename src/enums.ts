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
  ChatCommands = 'chat_commands',
  ConversationCommands = 'conversation_commands',
}

export enum GroupMemberPermissionEnum {
  All = 'all',
  CommandHealthcheck = 'command_healthcheck',
  CommandWarn = 'command_warn',
  CommandWarns = 'command_warns',
  CommandUnwarn = 'command_unwarn',
  CommandMute = 'command_mute',
  CommandUnmute = 'command_unmute',
}

export enum CommandTypeEnum {
  Conversation = 'conversation',
  Chat = 'chat',
}

export enum HandlerEventEnum {
  MessageNew = 'message_new',
}
