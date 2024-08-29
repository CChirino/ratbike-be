import { PartialType } from '@nestjs/swagger';
import { CreateLastreadingDto } from './create-lastreading.dto';

export class UpdateLastreadingDto extends PartialType(CreateLastreadingDto) {}
