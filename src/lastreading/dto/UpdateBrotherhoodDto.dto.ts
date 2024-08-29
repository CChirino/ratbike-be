import { IsDateString } from 'class-validator';

export class UpdateBrotherhoodDto {
  @IsDateString()
  brotherhood: Date;
}
