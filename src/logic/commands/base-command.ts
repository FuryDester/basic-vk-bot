import type { GroupPermission } from '@/types';
import CommandArgumentDto from '@/data-transfer-objects/misc/command-argument-dto';

abstract class BaseCommand {
  abstract getGroupPermissions(): GroupPermission[];

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

    return args;
  }
}

export default BaseCommand;
