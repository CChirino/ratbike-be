import { Controller, Body, Post, UseGuards, Param, Get } from '@nestjs/common';
import { UsersreadingService } from './usersreading.service';
import { CreateUsersreadingDto } from './dto/create-usersreading.dto';
import { AuthGuard } from '@nestjs/passport';

@Controller('usersreading')
export class UsersreadingController {
  constructor(private readonly usersreadingService: UsersreadingService) {}

  @Get('/:id')
  findUserReadingsById(@Param('id') id: string) {
    return this.usersreadingService.findOneByUserId(id);
  }

  @Post()
  @UseGuards(AuthGuard('jwt'))
  create(@Body() createUsersreadingDto: CreateUsersreadingDto) {
    return this.usersreadingService.create(createUsersreadingDto);
  }
}
