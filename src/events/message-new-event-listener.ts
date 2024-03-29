import BaseListener from '@/events/base-listener';
import BaseCommand from '@/logic/commands/base-command';
import HealthcheckCommand from '@/logic/commands/chat/healthcheck-command';
import VkClient from '@/wrappers/vk-client';
import { CommandTypeEnum, HandlerEventEnum, LogTagEnum } from '@/enums';
import GroupsData from '@/models/groups-data';
import Logger from '@/wrappers/logger';
import GroupDto from '@/data-transfer-objects/models/group-dto';
import CommandInsufficientArguments from '@/exceptions/custom-exceptions/command-insufficient-arguments';
import CommandArgumentDto from '@/data-transfer-objects/misc/command-argument-dto';
import type { HandlerEvent } from '@/types';
import StatisticsCollector from '@/wrappers/statistics-collector';
import HelpCommand from '@/logic/commands/chat/help-command';
import processUserMute from '@/logic/helpers/conversation/process-user-mute';
import WarnCommand from '@/logic/commands/conversation/warn-command';
import WarnsCommand from '@/logic/commands/conversation/warns-command';
import UnwarnCommand from '@/logic/commands/conversation/unwarn-command';
import MuteCommand from '@/logic/commands/conversation/mute-command';
import UnmuteCommand from '@/logic/commands/conversation/unmute-command';
import KickCommand from '@/logic/commands/conversation/kick-command';
import TechStatisticsCommand from '@/logic/commands/chat/techstatistics-command';
import SummaryTechStatisticsCommand from '@/logic/commands/chat/summary-tech-statistics-command';
import GivePermissionCommand from '@/logic/commands/chat/give-permission-command';
import TakePermissionCommand from '@/logic/commands/chat/take-permission-command';
import MyPermissionsCommand from '@/logic/commands/chat/my-permissions-command';
import GetPermissionsCommand from '@/logic/commands/chat/get-permissions-command';
import GetAllPermissionsCommand from '@/logic/commands/chat/get-all-permissions-command';
import processUserQuestion from '@/logic/helpers/chat/process-user-question';
import AddAutoAnswerCommand from '@/logic/commands/chat/add-auto-answer-command';
import RemoveAutoAnswerCommand from '@/logic/commands/chat/remove-auto-answer-command';
import SetPastebinCommand from '@/logic/commands/chat/set-pastebin-command';
import GetAutoAnswersCommand from '@/logic/commands/chat/get-auto-answers-command';
import EditAutoAnswerCommand from '@/logic/commands/chat/edit-auto-answer-command';
import GetAllSpecialEventsCommand from '@/logic/commands/chat/get-all-special-events-command';

class MessageNewEventListener extends BaseListener {
  private getCommands(): BaseCommand[] {
    return [
      new HealthcheckCommand(),
      new HelpCommand(),
      new WarnCommand(),
      new WarnsCommand(),
      new UnwarnCommand(),
      new MuteCommand(),
      new UnmuteCommand(),
      new KickCommand(),
      new TechStatisticsCommand(),
      new SummaryTechStatisticsCommand(),
      new GivePermissionCommand(),
      new TakePermissionCommand(),
      new MyPermissionsCommand(),
      new GetPermissionsCommand(),
      new GetAllPermissionsCommand(),
      new AddAutoAnswerCommand(),
      new EditAutoAnswerCommand(),
      new RemoveAutoAnswerCommand(),
      new SetPastebinCommand(),
      new GetAutoAnswersCommand(),
      new GetAllSpecialEventsCommand(),
    ];
  }

  getEventName(): HandlerEvent {
    return HandlerEventEnum.MessageNew;
  }

  private getCommandByText(text: string, parsedCommands?: BaseCommand[]): BaseCommand | null {
    const commands = parsedCommands ?? this.getCommands();
    let commandString = text.split(' ')[0];
    if (commandString.startsWith('/')) {
      commandString = commandString.slice(1);
    }

    return commands.find((command) => command.getName().toLowerCase() === commandString.toLowerCase()) || null;
  }

  // TODO
  private getAdditionalInfoByCommand(command: BaseCommand, _args: CommandArgumentDto[]): unknown {
    if (command.getName() === 'help') {
      return this.getCommands();
    }

    return {};
  }

  private handleCommand(data: VkBotContext, isConversation: boolean): void {
    const commands = this.getCommands()
      .filter((command) =>
        command.getCommandType() === (isConversation ? CommandTypeEnum.Conversation : CommandTypeEnum.Chat),
      );

    const command = this.getCommandByText(data.message.text, commands);
    if (!command) {
      return;
    }

    const groupsDataModel = new GroupsData();
    const groupObject = groupsDataModel.getTable().findOne({ id: data.groupId } as object);
    if (!groupObject) {
      Logger.error(`Group with id ${data.groupId} not found in database`, LogTagEnum.Handler);
      return;
    }

    const group = groupsDataModel.formDto(groupObject) as GroupDto;
    const user = group.members.find((member) => member.user_id === data.message.from_id);
    if (!user) {
      return;
    }

    if (!command.canExecute(group, user)) {
      data.reply('У вас недостаточно прав для выполнения этой команды.');
      Logger.warning(
        `User ${user.user_id} tried to execute command ${command.getName()} in group ${group.id} but he doesn't have enough permissions`,
        LogTagEnum.Command,
      );
      return;
    }

    let args = [];
    try {
      args = command.parseArguments(data.message.text);
    } catch (error) {
      if (error instanceof CommandInsufficientArguments) {
        data.reply(`Недостаточно аргументов для выполнения команды ${command.getName()}. Не хватает аргумента ${error.getOptions().argument}`);
        Logger.warning(
          `User ${user.user_id} does not complete command (insufficient arg: ${error.getOptions().argument})`,
          LogTagEnum.Command,
        );
      } else {
        data.reply(`Произошла ошибка при выполнении команды ${command.getName()}.`);
        Logger.error(
          `Error while parsing arguments for command ${command.getName()} in group ${group.id}: ${error.message}`,
          LogTagEnum.Command,
        );
      }

      return;
    }

    command.execute(data, group, user, args, this.getAdditionalInfoByCommand(command, args)).then((result) => {
      if (!result) {
        Logger.warning(
          `Command ${command.getName()} in group ${group.id} by user ${user.user_id} was not executed. Arguments: ${JSON.stringify(args)}`,
          LogTagEnum.Command,
        );

        StatisticsCollector.addCommandFailure();
        return;
      }

      Logger.info(
        `Command ${command.getName()} in group ${group.id} by user ${user.user_id} was executed. Arguments: ${JSON.stringify(args)}`,
        LogTagEnum.Command,
      );

      StatisticsCollector.addCommandExecution();
    });
  }

  handleEvent(data: VkBotContext): void {
    const isConversationMessage = VkClient.isConversationMessage(data);
    if (isConversationMessage) {
      processUserMute(data);
    } else {
      processUserQuestion(data);
    }

    const message = data.message.text.trim();
    if (!message) {
      return;
    }

    if (message.startsWith('/')) {
      this.handleCommand(data, isConversationMessage);
      return;
    }
  }
}

export default MessageNewEventListener;
