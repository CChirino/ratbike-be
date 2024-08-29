import { IsDateString } from 'class-validator';

export class UpdateStoreDto {
  @IsDateString()
  store: Date;
}
