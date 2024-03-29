import BaseCommand from '@/logic/commands/base-command';
import GroupDto from '@/data-transfer-objects/models/group-dto';
import GroupMemberDto from '@/data-transfer-objects/models/group-member-dto';
import CommandArgumentDto from '@/data-transfer-objects/misc/command-argument-dto';
import type { CommandType, GroupMemberPermission, GroupPermission } from '@/types';
import { CommandTypeEnum, GroupPermissionEnum, LogTagEnum } from '@/enums';
import Logger from '@/wrappers/logger';

class HelpCommand extends BaseCommand {
  async execute(
    context: VkBotContext,
    group: GroupDto,
    user: GroupMemberDto,
    args: CommandArgumentDto[],
    additionalInfo?: unknown,
  ): Promise<boolean> {
    const commandName = args.find(arg => arg.position === 1)?.argumentValue;
    // Summary data
    if (!commandName) {
      const commands = (additionalInfo as BaseCommand[]).filter(command => command.canExecute(group, user) && command.getName() !== this.getName());

      if (!commands.length) {
        Logger.warning(`No available commands found for group id: ${group.id}, user id: ${user.user_id}`, LogTagEnum.Command);
        context.reply('Доступные команды не найдены.');

        return false;
      }

      const chatCommands = commands.filter(command => command.getCommandType() === CommandTypeEnum.Chat);
      const conversationCommands = commands.filter(command => command.getCommandType() === CommandTypeEnum.Conversation);
      let finalString = 'Доступные команды:\n';
      if (chatCommands.length) {
        finalString += ` * Личные сообщения:\n${chatCommands.map(command => command.formCommandInfo()).join('\n')}\n`;
      }

      if (conversationCommands.length) {
        finalString += `${chatCommands.length ? '\n' : ''} * Беседа:\n${conversationCommands.map(command => command.formCommandInfo()).join('\n')}`;
      }

      context.reply(finalString);
    } else {
      // Detail data
      const command = (additionalInfo as BaseCommand[]).find(cmd => cmd.getName().toLowerCase() === commandName.toLowerCase());
      if (!command) {
        Logger.warning(`Cannot find command with name ${commandName}. group id: ${group.id}, user id: ${user.user_id}`, LogTagEnum.Command);
        context.reply('Не удалось найти команду.');

        return false;
      }

      if (!command.canExecute(group, user)) {
        Logger.warning(
          `User ${user.user_id} trying to get help for command ${commandName} but he has no permissions. group id: ${group.id}`,
          LogTagEnum.Command,
        );
        context.reply('У вас нет прав на получение данных по этой команде.');

        return false;
      }

      context.reply(`Информация по команде:\n${command.formCommandInfo(true)}\nПрописывается в ${
        command.getCommandType() === CommandTypeEnum.Chat ? 'личных сообщениях' : 'беседе'
      }.`);
    }

    return true;
  }

  getArguments(): CommandArgumentDto[] {
    const commandArgumentDto = new CommandArgumentDto();
    Object.assign(commandArgumentDto, {
      position    : 1,
      is_long     : false,
      is_optional : true,
      alias       : 'команда',
      description : 'Команда, о которой нужно получить информацию.',
    });

    return [commandArgumentDto];
  }

  getCommandType(): CommandType {
    return CommandTypeEnum.Chat;
  }

  getDescription(): string {
    return 'Получение сводных или детальных данных о доступных командах.';
  }

  getGroupMemberPermissions(): GroupMemberPermission[] {
    return [];
  }

  getGroupPermissions(): GroupPermission[] {
    return [GroupPermissionEnum.ChatCommands];
  }

  getName(): string {
    return 'help';
  }

  getUsage(): string {
    return 'При использовании команды выводит список доступных команд.';
  }
}

export default HelpCommand;
