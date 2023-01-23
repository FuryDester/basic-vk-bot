class GroupDto {
  id: number;

  name: string;

  token: string;

  members: Record<number, number>;
}

export default GroupDto;
