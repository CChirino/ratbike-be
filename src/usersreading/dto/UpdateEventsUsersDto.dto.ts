import { IsDateString } from 'class-validator';

export class UpdateEventsUsersDto {
  userId: string;
  @IsDateString()
  events: Date;
}
