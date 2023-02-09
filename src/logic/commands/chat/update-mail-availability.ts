// TODO  -  Realise

import BaseCommand from '@/logic/commands/base-command';
import type { CommandType, GroupMemberPermission, GroupPermission } from '@/types';
import CommandArgumentDto from '@/data-transfer-objects/misc/command-argument-dto';
import GroupDto from '@/data-transfer-objects/models/group-dto';
import GroupMemberDto from '@/data-transfer-objects/models/group-member-dto';
import { ActionHelperKeyEnum, CommandTypeEnum, GroupMemberPermissionEnum, GroupPermissionEnum } from '@/enums';
import MailUsers from '@/models/mail-users';
import getClientByGroupId from '@/logic/helpers/misc/get-client-by-group-id';
import ActionHelpers from '@/models/action-helpers';
import ActionHelperDto from '@/data-transfer-objects/models/action-helper-dto';

const CHUNK_SIZE = 1000;

class UpdateMailAvailability extends BaseCommand {
  private getProcessText(text: string, current: number, total: number): string {
    return `${text} (${current}/${total})`;
  }

  async execute(
    context: VkBotContext,
    group: GroupDto,
    _user: GroupMemberDto,
    _args: CommandArgumentDto[],
    _additionalInfo?: unknown,
  ): Promise<boolean> {
    const mailUsersModel = new MailUsers();
    const mailUsersTable = mailUsersModel.getTable();

    context.reply('Начинаю обновление списка пользователей, которым разрешено получать рассылки');
    const client = getClientByGroupId(group.id);
    const sendMessageResult = await client.sendMessage(context.message.from_id, 'Плэйсхолдер');
    const placeholderMessageId = sendMessageResult.message_id;

    const actionHelpersModel = new ActionHelpers();
    const actionHelpersTable = actionHelpersModel.getTable();
    let placeholderHelper = actionHelpersTable.findOne({
      group_id : group.id,
      key      : ActionHelperKeyEnum.UpdateMailAvailabilityPlaceholder,
    } as object);

    let offset = 0;
    let currentChunkSize = CHUNK_SIZE;
    do {
      const mailUsers = mailUsersTable
        .chain()
        .limit(CHUNK_SIZE)
        .offset(offset)
        .find({
          group_id: group.id,
        } as object)
        .data();

      currentChunkSize = mailUsers.length;

    } while (currentChunkSize === CHUNK_SIZE);


    return true;
  }

  getArguments(): CommandArgumentDto[] {
    return [];
  }

  getCommandType(): CommandType {
    return CommandTypeEnum.Chat;
  }

  getDescription(): string {
    return 'Обновляет список пользователей, которым разрешено получать рассылки';
  }

  getGroupMemberPermissions(): GroupMemberPermission[] {
    return [GroupMemberPermissionEnum.CommandUpdateMailAvailability];
  }

  getGroupPermissions(): GroupPermission[] {
    return [GroupPermissionEnum.Mailing, GroupPermissionEnum.ChatCommands];
  }

  getName(): string {
    return 'updatemailavailability';
  }

  getUsage(): string {
    return '';
  }
}

export default UpdateMailAvailability;
