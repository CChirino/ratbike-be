import { PartialType } from '@nestjs/swagger';
import { CreateUsersreadingDto } from './create-usersreading.dto';

export class UpdateUsersreadingDto extends PartialType(CreateUsersreadingDto) {}
