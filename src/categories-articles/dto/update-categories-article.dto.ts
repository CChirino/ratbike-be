import { PartialType } from '@nestjs/swagger';
import { CreateCategoriesArticleDto } from './create-categories-article.dto';
import { IsNotEmpty, IsOptional, IsObject } from 'class-validator';

export class UpdateCategoriesArticleDto extends PartialType(
  CreateCategoriesArticleDto,
) {
  @IsNotEmpty()
  @IsObject()
  translationNameCategoryProduct: Record<string, any>;
  @IsOptional()
  urlImageCategoryArticles: string;
}
