import { IsNotEmpty, IsOptional, IsObject } from 'class-validator';
export class CreateCategoriesArticleDto {
  [x: string]: any;
  @IsNotEmpty()
  @IsObject()
  translationNameCategoryProduct: Record<string, any>;
  @IsOptional()
  urlImageCategoryArticles: string;
}
