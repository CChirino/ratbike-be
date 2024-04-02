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

@ApiTags('categories-brotherhood')
@Controller('categories-brotherhood')
export class CategoriesBrotherhoodController {
  constructor(
    private readonly categoriesBrotherhoodService: CategoriesBrotherhoodService,
  ) {}

  @Post()
  @UseGuards(AuthGuard('jwt'))
  @UseInterceptors(FileInterceptor('urlImageCategoryBrotherhood'))
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
  @UseGuards(AuthGuard('jwt'))
  findAll() {
    return this.categoriesBrotherhoodService.findAll();
  }

  @Get(':id')
  @UseGuards(AuthGuard('jwt'))
  findOne(@Param('id') id: string) {
    return this.categoriesBrotherhoodService.findOne(id);
  }

  @Patch(':id')
  @UseGuards(AuthGuard('jwt'))
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
  remove(@Param('id') id: string) {
    return this.categoriesBrotherhoodService.remove(id);
  }
}
