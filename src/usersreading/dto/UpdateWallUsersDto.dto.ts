import { IsDateString } from 'class-validator';

export class UpdateWallUsersDto {
  userId: string;
  @IsDateString()
  wall: Date;
}
