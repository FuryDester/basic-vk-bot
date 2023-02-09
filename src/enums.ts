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
  TechStatistics = 'tech_statistics',
  Mailing = 'mailing',
}

export enum GroupMemberPermissionEnum {
  All = 'all',
  CommandHealthcheck = 'command_healthcheck',
  CommandWarn = 'command_warn',
  CommandWarns = 'command_warns',
  CommandUnwarn = 'command_unwarn',
  CommandMute = 'command_mute',
  CommandUnmute = 'command_unmute',
  CommandKick = 'command_kick',
  CountTechStatistics = 'count_tech_statistics',
  CommandSummaryTechStatistics = 'command_summary_tech_statistics',
  CommandGivePermission = 'command_give_permission',
  CommandTakePermission = 'command_take_permission',
  CommandMyPermissions = 'command_my_permissions',
  CommandGetPermissions = 'command_get_permissions',
  CommandGetAllPermissions = 'command_get_all_permissions',
  CommandUpdateMailAvailability = 'command_update_mail_availability',
}

export enum CommandTypeEnum {
  Conversation = 'conversation',
  Chat = 'chat',
}

export enum HandlerEventEnum {
  MessageNew = 'message_new',
  MessageEdit = 'message_edit',
  MessageReply = 'message_reply',
}

export enum ActionHelperKeyEnum {
  UpdateMailAvailabilityPlaceholder = 'update_mail_availability_placeholder',
  UpdateMailAvailabilityOffset = 'update_mail_availability_offset',
  UpdateMailAvailabilityStep = 'update_mail_availability_step',
  UpdateMailAvailabilityRunning = 'update_mail_availability_running',
}

export enum UpdateMailAvailabilityStepEnum {
  UpdateExisting = 'update_existing',
  AddNewGroup = 'add_new_group',
  AddNewDialogues = 'add_new_dialogues',
}
