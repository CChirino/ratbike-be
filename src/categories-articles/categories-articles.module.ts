import { Module } from '@nestjs/common';
import { CategoriesArticlesService } from './categories-articles.service';
import { CategoriesArticlesController } from './categories-articles.controller';

@Module({
  controllers: [CategoriesArticlesController],
  providers: [CategoriesArticlesService],
})
export class CategoriesArticlesModule {}
