import { IsDateString } from 'class-validator';

export class UpdateEventsDto {
  @IsDateString()
  events: Date;
}
