import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { CategoriesArticlesService } from './categories-articles.service';
import { CreateCategoriesArticleDto } from './dto/create-categories-article.dto';
import { UpdateCategoriesArticleDto } from './dto/update-categories-article.dto';

@Controller('categories-articles')
export class CategoriesArticlesController {
  constructor(private readonly categoriesArticlesService: CategoriesArticlesService) {}

  @Post()
  create(@Body() createCategoriesArticleDto: CreateCategoriesArticleDto) {
    return this.categoriesArticlesService.create(createCategoriesArticleDto);
  }

  @Get()
  findAll() {
    return this.categoriesArticlesService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.categoriesArticlesService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateCategoriesArticleDto: UpdateCategoriesArticleDto) {
    return this.categoriesArticlesService.update(+id, updateCategoriesArticleDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.categoriesArticlesService.remove(+id);
  }
}
