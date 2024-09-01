import { IsDateString } from 'class-validator';

export class UpdateNewsUsersDto {
  userId: string;
  @IsDateString()
  news: Date;
}
