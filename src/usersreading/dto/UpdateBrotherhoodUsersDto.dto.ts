import { IsDateString } from 'class-validator';

export class UpdateBrotherhoodUsersDto {
  userId: string;
  @IsDateString()
  brotherhood: Date;
}
