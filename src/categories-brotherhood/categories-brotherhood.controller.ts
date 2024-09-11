import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseInterceptors,
  UploadedFile,
  Res,
  UseGuards,
} from '@nestjs/common';
import { CategoriesBrotherhoodService } from './categories-brotherhood.service';
import { CreateCategoriesBrotherhoodDto } from './dto/create-categories-brotherhood.dto';
import { UpdateCategoriesBrotherhoodDto } from './dto/update-categories-brotherhood.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiTags } from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';
import { Roles } from 'src/decorators/roles.decorator';
import { RolesGuard } from 'src/guards/roles.guard';

@ApiTags('categories-brotherhood')
@Controller('categories-brotherhood')
@UseGuards(RolesGuard)
export class CategoriesBrotherhoodController {
  constructor(
    private readonly categoriesBrotherhoodService: CategoriesBrotherhoodService,
  ) {}

  @Post()
  @UseGuards(AuthGuard('jwt'))
  @UseInterceptors(FileInterceptor('urlImageCategoryBrotherhood'))
  @Roles('admin', 'moderador')
  create(
    @Body() createCategoriesBrotherhoodDto: CreateCategoriesBrotherhoodDto,
    @UploadedFile() file: Express.Multer.File,
    @Res() response,
  ) {
    return this.categoriesBrotherhoodService.create(
      createCategoriesBrotherhoodDto,
      file,
      response,
    );
  }

  @Get()
  @Roles('public', 'admin', 'moderador', 'user')
  findAll() {
    return this.categoriesBrotherhoodService.findAll();
  }

  @Get(':id')
  @Roles('admin', 'moderador', 'user', 'public')
  findOne(@Param('id') id: string) {
    return this.categoriesBrotherhoodService.findOne(id);
  }

  @Patch(':id')
  @UseGuards(AuthGuard('jwt'))
  @Roles('admin', 'moderador')
  update(
    @Param('id') id: string,
    @Body() updateCategoriesBrotherhoodDto: UpdateCategoriesBrotherhoodDto,
  ) {
    return this.categoriesBrotherhoodService.update(
      id,
      updateCategoriesBrotherhoodDto,
    );
  }

  @Delete(':id')
  @UseGuards(AuthGuard('jwt'))
  @Roles('admin', 'moderador')
  remove(@Param('id') id: string) {
    return this.categoriesBrotherhoodService.remove(id);
  }
}
