class GroupDto {
  id: number;

  name: string;

  token: string;

  members: Record<number, number>;

  permissions: Record<string, boolean>;
}

export default GroupDto;
