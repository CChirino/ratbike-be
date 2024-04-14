import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseInterceptors,
  UploadedFiles,
  Res,
  UseGuards,
  Req,
  Query,
} from '@nestjs/common';
import { WallService } from './wall.service';
import { CreateWallDto } from './dto/create-wall.dto';
import { UpdateWallDto } from './dto/update-wall.dto';
import { AnyFilesInterceptor } from '@nestjs/platform-express';
import { ApiTags } from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';
import { Request } from 'express';

@ApiTags('wall')
@Controller('wall')
export class WallController {
  constructor(private readonly wallService: WallService) {}

  @Post()
  @UseGuards(AuthGuard('jwt'))
  @UseInterceptors(AnyFilesInterceptor())
  create(
    @Body() createWallDto: CreateWallDto,
    @UploadedFiles() files: Express.Multer.File[],
    @Res() response,
    @Req() request: Request,
  ) {
    const user = request.user;
    return this.wallService.create(createWallDto, files, user, response);
  }

  @Get()
  @UseGuards(AuthGuard('jwt'))
  findAll(
    @Query('page') page?: number,
    @Query('limit') limit?: number,
    @Query('category') category?: string,
  ) {
    return this.wallService.findAll(page, limit, category);
  }

  @Get(':id')
  @UseGuards(AuthGuard('jwt'))
  findOne(@Param('id') id: string) {
    return this.wallService.findOne(id);
  }

  @Patch(':id')
  @UseGuards(AuthGuard('jwt'))
  update(
    @Param('id') id: string,
    @Body() updateWallDto: UpdateWallDto,
    @Req() request: Request,
    @Res() response,
  ) {
    const user = request.user;
    return this.wallService.update(id, updateWallDto, user, response);
  }

  @Delete(':id')
  @UseGuards(AuthGuard('jwt'))
  remove(@Param('id') id: string) {
    return this.wallService.remove(id);
  }
}
