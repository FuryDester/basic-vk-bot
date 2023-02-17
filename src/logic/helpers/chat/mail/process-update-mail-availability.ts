// eslint-disable-file @typescript-eslint/no-unused-vars
// TODO  -  implement

import type { UpdateMailAvailabilityStep } from '@/types';
import { UpdateMailAvailabilityStepEnum } from '@/enums';

const CHUNK_SIZE = 1000;

async function processDialoguesUsers(context: VkBotContext, offset: number): Promise<boolean> {
  return true;
}

async function processGroupUsers(context: VkBotContext, offset: number): Promise<boolean> {
  return processDialoguesUsers(context, 0);
}

async function processExistingUsers(context: VkBotContext, offset: number): Promise<boolean> {


  return processGroupUsers(context, 0);
}

export default async (
  context: VkBotContext,
  step: UpdateMailAvailabilityStep = UpdateMailAvailabilityStepEnum.UpdateExisting,
  offset: number = 0,
): Promise<boolean> => {

  switch (step) {
    case UpdateMailAvailabilityStepEnum.UpdateExisting:
      return processExistingUsers(context, offset);
    case UpdateMailAvailabilityStepEnum.AddNewGroup:
      return processGroupUsers(context, offset);
    case UpdateMailAvailabilityStepEnum.AddNewDialogues:
      return processDialoguesUsers(context, offset);
  }

  return false;
};
