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
import { Roles } from 'src/decorators/roles.decorator';
import { RolesGuard } from 'src/guards/roles.guard';

@ApiTags('wall')
@Controller('wall')
@UseGuards(RolesGuard)
export class WallController {
  constructor(private readonly wallService: WallService) {}

  @Post()
  @UseGuards(AuthGuard('jwt'))
  @UseInterceptors(AnyFilesInterceptor())
  @Roles('admin', 'moderador', 'user')
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
  @Roles('public', 'admin', 'moderador', 'user')
  findAll(
    @Query('page') page?: number,
    @Query('limit') limit?: number,
    @Query('skills') skills?: string,
    @Query('search') search?: string,
    @Query('countries') countries?: string,
    @Query('wallstatus') wallStatus?: string,
    @Query('type') wallType?: string,
    @Query('modality') wallModality?: string,
    @Query('userid') ownerId?: string
  ) {
    return this.wallService.findAll(
      page,
      limit,
      search,
      skills,
      countries,
      wallStatus,
      wallType,
      wallModality,
      ownerId
    );
  }

  @Get(':id')
  @UseGuards(AuthGuard('jwt'))
  @Roles('public', 'admin', 'moderador', 'user')
  findOne(@Param('id') id: string) {
    return this.wallService.findOne(id);
  }

  @Patch(':id')
  @UseGuards(AuthGuard('jwt'))
  @Roles('admin', 'moderador', 'user')
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
  @Roles('user', 'admin', 'moderador')
  remove(@Param('id') id: string) {
    return this.wallService.remove(id);
  }

  @Get('revision')
  @UseGuards(AuthGuard('jwt'))
  @Roles('admin', 'moderador')
  findRevision(
    @Query('page') page?: number,
    @Query('limit') limit?: number,
    @Query('skills') skills?: string,
  ) {
    return this.wallService.findRevision(page, limit, skills);
  }

  @Get('country')
  @UseGuards(AuthGuard('jwt'))
  @Roles('admin', 'moderador', 'user')
  getWallsByCountry(@Res() response, @Req() request: Request) {
    const user = request.user;
    return this.wallService.getWallsByCountry(user, response);
  }
}
