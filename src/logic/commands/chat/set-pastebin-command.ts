import BaseCommand from '@/logic/commands/base-command';
import type { CommandType, GroupMemberPermission, GroupPermission } from '@/types';
import CommandArgumentDto from '@/data-transfer-objects/misc/command-argument-dto';
import GroupDto from '@/data-transfer-objects/models/group-dto';
import GroupMemberDto from '@/data-transfer-objects/models/group-member-dto';
import { CommandTypeEnum, GroupMemberPermissionEnum, LogTagEnum } from '@/enums';
import PastebinAPI from 'pastebin-ts';
import Logger from '@/wrappers/logger';
import GroupsData from '@/models/groups-data';

class SetPastebinCommand extends BaseCommand {
  async execute(
    context: VkBotContext,
    group: GroupDto,
    user: GroupMemberDto,
    args: CommandArgumentDto[],
    _additionalInfo?: unknown,
  ): Promise<boolean> {
    const key = args.find((item) => item.position === 1)?.argumentValue;
    if (!key) {
      context.reply('Не передан ключ');
      Logger.warning(`No pastebin key supplied in group ${group.id}`, LogTagEnum.Command);

      return false;
    }

    context.reply('Проверяем ключ...');

    const pastebin = new PastebinAPI({
      api_dev_key: key,
    });

    try {
      await pastebin.getUserInfo();

      const newGroup = group;
      newGroup.pastebin_token = key;

      const groupTable = (new GroupsData()).getTable();
      groupTable.update(newGroup);

      context.reply('Ключ прошёл валидацию и добавлен в настройки группы! Не забудьте удалить сообщение с командой');
      Logger.info(`Added new pastebin key to group ${group.id}, key: ${key}`, LogTagEnum.Command);

      return true;
    } catch (e) {
      context.reply(`Сервер вернул ошибку: ${e.message}`);
      Logger.warning(`Pastebin returned error: ${e.message} (group id: ${group.id})`, LogTagEnum.Command);

      return false;
    }
  }

  getArguments(): CommandArgumentDto[] {
    const pastebinTokenArgument = new CommandArgumentDto();
    pastebinTokenArgument.position = 1;
    pastebinTokenArgument.description = 'API токен Pastebin';
    pastebinTokenArgument.is_long = false;
    pastebinTokenArgument.is_optional = false;
    pastebinTokenArgument.alias = 'токен';

    return [pastebinTokenArgument];
  }

  getCommandType(): CommandType {
    return CommandTypeEnum.Chat;
  }

  getDescription(): string {
    return 'Устанавливает токен pastebin, необходимый для выгрузок.';
  }

  getGroupMemberPermissions(): GroupMemberPermission[] {
    return [GroupMemberPermissionEnum.CommandSetPastebin];
  }

  getGroupPermissions(): GroupPermission[] {
    return [];
  }

  getName(): string {
    return 'setpastebin';
  }

  getUsage(): string {
    return '/setpastebin <token>';
  }

}

export default SetPastebinCommand;
