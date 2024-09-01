import { IsDateString } from 'class-validator';

export class UpdateStoreUsersDto {
  userId: string;
  @IsDateString()
  store: Date;
}
