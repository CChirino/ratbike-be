import { PartialType } from '@nestjs/swagger';
import { CreateLastReadingDto } from './create-lastreading.dto';

export class UpdateLastreadingDto extends PartialType(CreateLastReadingDto) {}
