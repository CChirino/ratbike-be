import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  UseGuards,
  SetMetadata,
} from '@nestjs/common';
import { UserService } from './user.service';
import { User } from './schema/user.schema';
// import { RolesGuard } from './guard/roles.guard';
import { JwtAuthGuard } from '../auth/auth.guard';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('users')
@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post()
  // @UseGuards(RolesGuard)
  @SetMetadata('roles', ['admin', 'moderador'])
  create(@Body() user: User) {
    return this.userService.create(user);
  }

  @Get()
  @UseGuards(JwtAuthGuard)
  @SetMetadata('roles', ['admin', 'moderador'])
  findAll() {
    return this.userService.findAll();
  }

  @Get(':id')
  // @UseGuards(RolesGuard)
  @SetMetadata('roles', ['admin', 'moderador'])
  findOne(@Param('id') id: string) {
    return this.userService.findOne(id);
  }

  @Put(':id')
  // @UseGuards(RolesGuard)
  @SetMetadata('roles', ['admin', 'moderador'])
  update(@Param('id') id: string, @Body() user: User) {
    return this.userService.update(id, user);
  }

  @Delete(':id')
  // @UseGuards(RolesGuard)
  @SetMetadata('roles', ['admin', 'moderador'])
  remove(@Param('id') id: string) {
    return this.userService.remove(id);
  }
}
