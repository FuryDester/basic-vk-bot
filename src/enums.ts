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

export enum EventPriorityEnum {
  Highest = 100,
  High = 75,
  Normal = 50,
  Low = 25,
  Lowest = 0,
}
