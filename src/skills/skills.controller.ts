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
import { SkillsService } from './skills.service';
import { CreateSkillDto } from './dto/create-skill.dto';
import { UpdateSkillDto } from './dto/update-skill.dto';
import { ApiTags } from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';
import { Request } from 'express';
import { AnyFilesInterceptor } from '@nestjs/platform-express';
import { RolesGuard } from 'src/guards/roles.guard';
import { Roles } from 'src/decorators/roles.decorator';

@ApiTags('skills')
@Controller('skills')
@UseGuards(RolesGuard)
export class SkillsController {
  constructor(private readonly skillsService: SkillsService) {}

  @Post()
  @UseGuards(AuthGuard('jwt'))
  @UseInterceptors(AnyFilesInterceptor())
  @Roles('admin', 'moderador', 'user')
  create(
    @Body() createSkillDto: CreateSkillDto,
    @UploadedFiles() files: Express.Multer.File[],
    @Res() response,
    @Req() request: Request,
  ) {
    const user = request.user;
    return this.skillsService.create(createSkillDto, files, user, response);
  }

  @Get()
  @UseGuards(AuthGuard('jwt'))
  @Roles('admin', 'moderador', 'user')
  findAll(
    @Query('page') page?: number,
    @Query('limit') limit?: number,
    @Query('search') search?: string,
    @Query('countries') countries?: string,
    @Query('wallstatus') wallStatus?: string,
  ) {
    return this.skillsService.findAll(
      page,
      limit,
      search,
      countries,
      wallStatus,
    );
  }

  @Get(':id')
  @UseGuards(AuthGuard('jwt'))
  @Roles('admin', 'moderador', 'user')
  findOne(@Param('id') id: string) {
    return this.skillsService.findOne(id);
  }

  @Patch(':id')
  @UseGuards(AuthGuard('jwt'))
  @Roles('admin', 'moderador', 'user')
  update(
    @Param('id') id: string,
    @Body() updateSkillDto: UpdateSkillDto,
    @Req() request: Request,
    @Res() response,
  ) {
    const user = request.user;
    return this.skillsService.update(id, updateSkillDto, user, response);
  }

  @Delete(':id')
  @UseGuards(AuthGuard('jwt'))
  @Roles('admin', 'moderador')
  remove(@Param('id') id: string) {
    return this.skillsService.remove(id);
  }
}
