
## Environment Variables

To run this project, you will need to add the following environment variables to your .env file

`DATABASE_NAME` - name of the database file (this project is using loki.js)

## Deployment

To deploy this project run:

Installing packages:
```bash
  npm run install
```

Building typescript:
```bash
  npm run build
```

Filling database:
```bash
  npm run fill
```

Starting bot instance:
```bash
  npm run start
```


## FAQ

#### What does group permissions mean?

|   Permission name    |                  Description                   |
|:--------------------:|:----------------------------------------------:|
|         All          |    Group will have all possible permissions    |
|     ChatCommands     |        Access to perform chat commands         |
| ConversationCommands |    Access to perform conversation commands     |
|    TechStatistics    |       Perform tech statistics monitoring       |
|       Mailing        | Perform mail functionality (in work right now) |
|     AutoAnswers      |    Access to template answers functionality    | 

#### What does member permissions mean?

|        Permission name        |                                              Description                                               |
|:-----------------------------:|:------------------------------------------------------------------------------------------------------:|
|              All              |                                Member will have all posible permissions                                |
|      CommandHealthcheck       |                                     Access to healthcheck command                                      |
|          CommandWarn          |                                         Access to warn command                                         |
|         CommandWarns          |                                        Access to warns command                                         |
|         CommandUnwarn         |                                        Access to unwarn command                                        |
|          CommandMute          |                                         Access to mute command                                         |
|         CommandUnmute         |                                        Access to unmute command                                        |
|          CommandKick          |                                         Access to kick command                                         |
|      CountTechStatistics      | Flag that bot uses to write answer statistics by user, also gives permission to techstatistics command |
| CommandSummaryTechStatistics  |                                Access to summarytechstatistics command                                 |
|     CommandGivePermission     |                                    Access to givepermission command                                    |
|     CommandTakePermission     |                                    Access to takepermission command                                    |
|     CommandMyPermissions      |                                    Access to mypermissions command                                     |
|     CommandGetPermissions     |                                    Access to getpermissions command                                    |
|   CommandGetAllPermissions    |                                  Access to getallpermissions command                                   |
| CommandUpdateMailAvailability |                         Access to updatemailavailability command (in work atm)                         |
|     CommandAddAutoAnswer      |                                    Access to addautoanswer command                                     |
|    CommandRemoveAutoAnswer    |                                   Access to removeautoanswer command                                   |
|     CommandGetAutoAnswers     |                                    Access to getautoanswers command                                    |
|     CommandEditAutoAnswer     |                                    Access to editautoanswer command                                    |
|      CommandSetPastebin       |                                     Access to setpastebin command                                      |
|  CommandGetAllSpecialEvents   |                                 Access to getallspecialevents command                                  |

#### Why do I need to setup pastebin token?

Because some commands needs larger space than VK Api can perform. Also, looking in future, statistics can be generated using pastebin.

### How to split long argument?

In long command arguments we use ` -@-` as a delimeter (with space on start), for example:
`/editautoanswer 1 hello|good morning -@- notify_tech`

### What are special events?

Special events are used if template needs dynamic view or needs to implement some logic. Available special events:

| Event name |              Description               |
|:----------:|:--------------------------------------:|
| NotifyTech | Send tech notification by written user | 


## Authors

- [@FuryDester](https://github.com/FuryDester)

## Work in progress...

Please be patient and ask developer if you have any questions on why and how bot should run.

## Contacts
Telegram: [@FuryDester](https://t.me/furydester)

VK: [@FuryDester](https://vk.com/furydester)

## TODO List

- Make mail functionality;
- Write and correct readme;
- Probably add more special events.

## License

[GNU GPLv3](https://choosealicense.com/licenses/gpl-3.0/)
