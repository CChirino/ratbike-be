import { IsNotEmpty, IsOptional, IsObject } from 'class-validator';
export class CreateCategoriesProductDto {
  [x: string]: any;
  @IsNotEmpty()
  nameCategoryProduct: string;
  @IsObject()
  translationNameCategoryProduct: Record<string, any>;
  @IsOptional()
  urlImageCategory: string;
}
