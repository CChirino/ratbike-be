import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Res,
  Req,
} from '@nestjs/common';
import { EventsService } from './events.service';
import { CreateEventDto } from './dto/create-event.dto';
import { UpdateEventDto } from './dto/update-event.dto';
import { AuthGuard } from '@nestjs/passport';
import { Request } from 'express';
import { RolesGuard } from 'src/guards/roles.guard';
import { Roles } from 'src/decorators/roles.decorator';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('events')
@Controller('events')
@UseGuards(RolesGuard)
export class EventsController {
  constructor(private readonly eventsService: EventsService) {}

  @Post()
  @UseGuards(AuthGuard('jwt'))
  @Roles('admin', 'moderador', 'user', 'public')
  create(
    @Body() createEventDto: CreateEventDto,
    @Res() response,
    @Req() request: Request,
  ) {
    const user = request.user;
    return this.eventsService.create(createEventDto, user, response);
  }

  @Get()
  @UseGuards(AuthGuard('jwt'))
  @Roles('public', 'admin', 'moderador', 'user')
  findAll(@Req() request: Request) {
    const user = request.user;
    return this.eventsService.findAll(user);
  }

  @Get(':id')
  @UseGuards(AuthGuard('jwt'))
  @Roles('admin', 'moderador', 'user', 'public')
  findOne(@Param('id') id: string) {
    return this.eventsService.findOne(id);
  }

  @Patch(':id')
  @UseGuards(AuthGuard('jwt'))
  @Roles('admin', 'moderador')
  update(@Param('id') id: string, @Body() updateEventDto: UpdateEventDto) {
    return this.eventsService.update(id, updateEventDto);
  }

  @Delete(':id')
  @UseGuards(AuthGuard('jwt'))
  @Roles('admin', 'moderador')
  remove(@Param('id') id: string) {
    return this.eventsService.remove(id);
  }
}
