import { IsDateString } from 'class-validator';

export class UpdateWallDto {
  @IsDateString()
  wall: Date;
}
