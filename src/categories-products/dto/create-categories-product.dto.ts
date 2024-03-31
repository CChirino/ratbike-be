import { IsNotEmpty, IsOptional, IsObject } from 'class-validator';
export class CreateCategoriesProductDto {
  @IsNotEmpty()
  nameCategoryProduct: string;
  @IsObject()
  translationNameCategoryProduct: Record<string, any>;
  @IsOptional()
  urlImageCategory: string;
}
