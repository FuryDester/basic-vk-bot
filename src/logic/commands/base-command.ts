import type { GroupPermission, CommandType, GroupMemberPermission } from '@/types';
import { GroupPermissionEnum, GroupMemberPermissionEnum } from '@/enums';
import CommandArgumentDto from '@/data-transfer-objects/misc/command-argument-dto';
import GroupMemberDto from '@/data-transfer-objects/models/group-member-dto';
import GroupDto from '@/data-transfer-objects/models/group-dto';
import CommandInsufficientArguments from '@/exceptions/custom-exceptions/command-insufficient-arguments';

abstract class BaseCommand {
  abstract getGroupPermissions(): GroupPermission[];

  abstract getGroupMemberPermissions(): GroupMemberPermission[];

  canExecute(group: GroupDto, user: GroupMemberDto): boolean {
    const requiredGroupPermissions = this.getGroupPermissions();
    const requiredGroupMemberPermissions = this.getGroupMemberPermissions();

    if (
      (!group.permissions.length && requiredGroupPermissions.length)
      || (!user.permissions.length && requiredGroupMemberPermissions.length)
    ) {
      return false;
    }

    // Checking group permissions
    if (
      requiredGroupPermissions.find((permission) => !group.permissions.includes(permission))
      && !group.permissions.includes(GroupPermissionEnum.All)
    ) {
      return false;
    }

    // Checking group member permissions
    return !(requiredGroupMemberPermissions.find((permission) => !user.permissions.includes(permission))
      && !user.permissions.includes(GroupMemberPermissionEnum.All));
  }

  /**
   * Executes command
   * @returns true if command was executed successfully, false otherwise
   */
  abstract execute(context: VkBotContext, group: GroupDto, user: GroupMemberDto, args: CommandArgumentDto[], additionalInfo?: unknown): boolean;

  abstract getCommandType(): CommandType;

  abstract getName(): string;

  abstract getDescription(): string;

  abstract getUsage(): string;

  abstract getArguments(): CommandArgumentDto[];

  // Adds values to command arguments DTOs
  parseArguments(commandLine: string): CommandArgumentDto[] {
    const args = this.getArguments().sort((first, second) => first.position - second.position);
    const longArgumentEnding = '--@--';

    // Splitting command line into arguments
    let commandIterator = 0;
    commandLine.trim().split(' ').slice(1).forEach((argument) => {
      if (commandIterator >= args.length) {
        return;
      }

      if (!args[commandIterator].isLong) {
        args[commandIterator].argumentValue = argument;

        commandIterator++;
      } else {
        // Long argument
        if (argument.trim() === longArgumentEnding) {
          commandIterator++;
        } else {
          args[commandIterator].argumentValue = (args[commandIterator].argumentValue || '') + argument + ' ';
        }
      }
    });

    // Checking if all required arguments are present
    const missingArgument = args.find((arg) => !arg.isOptional && !arg.argumentValue);
    if (missingArgument) {
      throw new CommandInsufficientArguments('Not all arguments presented in command.', { argument: missingArgument.alias });
    }

    return args;
  }

  formCommandInfo(detail: boolean = false): string {
    const args = this.getArguments().sort((first, second) => first.position - second.position);
    const argsInfo = args.map((arg) => {
      return `${arg.isOptional ? '?' : ''}${arg.alias}${arg.isLong ? '...' : ''}${detail ? ` - ${arg.description}` : ''}`;
    }).join(detail ? '\n' : ' ');

    let commandInfo = `/${this.getName()}`;
    if (detail) {
      commandInfo += ` - ${this.getDescription()}\n${this.getUsage()}\n${argsInfo.length ? 'Параметры:\n' : ''}${argsInfo}`;
    } else {
      commandInfo += ` ${argsInfo} - ${this.getDescription()}`;
    }

    return commandInfo;
  }
}

export default BaseCommand;
