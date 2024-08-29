import { IsDateString } from 'class-validator';

export class UpdateNewsDto {
  @IsDateString()
  news: Date;
}
