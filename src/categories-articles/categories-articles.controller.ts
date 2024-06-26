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
import { CategoriesArticlesService } from './categories-articles.service';
import { CreateCategoriesArticleDto } from './dto/create-categories-article.dto';
import { UpdateCategoriesArticleDto } from './dto/update-categories-article.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiTags } from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';
import { Roles } from 'src/decorators/roles.decorator';
import { RolesGuard } from 'src/guards/roles.guard';

@ApiTags('categories-articles')
@Controller('categories-articles')
@UseGuards(RolesGuard)
export class CategoriesArticlesController {
  constructor(
    private readonly categoriesArticlesService: CategoriesArticlesService,
  ) {}

  @Post()
  @UseGuards(AuthGuard('jwt'))
  @UseInterceptors(FileInterceptor('urlImageCategoryArticles'))
  @Roles('admin', 'moderador', 'user')
  create(
    @Body() createCategoriesArticleDto: CreateCategoriesArticleDto,
    @UploadedFile() file: Express.Multer.File,
    @Res() response,
  ) {
    return this.categoriesArticlesService.create(
      createCategoriesArticleDto,
      file,
      response,
    );
  }

  @Get()
  @Roles('public', 'admin', 'moderador', 'user')
  findAll() {
    return this.categoriesArticlesService.findAll();
  }

  @Get(':id')
  @UseGuards(AuthGuard('jwt'))
  @Roles('admin', 'moderador', 'user')
  findOne(@Param('id') id: string) {
    return this.categoriesArticlesService.findOne(id);
  }

  @Patch(':id')
  @UseGuards(AuthGuard('jwt'))
  @Roles('admin', 'moderador', 'user')
  update(
    @Param('id') id: string,
    @Body() updateCategoriesArticleDto: UpdateCategoriesArticleDto,
  ) {
    return this.categoriesArticlesService.update(
      id,
      updateCategoriesArticleDto,
    );
  }

  @Delete(':id')
  @UseGuards(AuthGuard('jwt'))
  @Roles('admin', 'moderador')
  remove(@Param('id') id: string) {
    return this.categoriesArticlesService.remove(id);
  }
}
