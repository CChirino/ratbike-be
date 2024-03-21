import { Injectable } from '@nestjs/common';
import { CreateCategoriesArticleDto } from './dto/create-categories-article.dto';
import { UpdateCategoriesArticleDto } from './dto/update-categories-article.dto';

@Injectable()
export class CategoriesArticlesService {
  create(createCategoriesArticleDto: CreateCategoriesArticleDto) {
    return 'This action adds a new categoriesArticle';
  }

  findAll() {
    return `This action returns all categoriesArticles`;
  }

  findOne(id: number) {
    return `This action returns a #${id} categoriesArticle`;
  }

  update(id: number, updateCategoriesArticleDto: UpdateCategoriesArticleDto) {
    return `This action updates a #${id} categoriesArticle`;
  }

  remove(id: number) {
    return `This action removes a #${id} categoriesArticle`;
  }
}
