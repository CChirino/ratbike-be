import { IsNotEmpty, IsOptional, IsObject } from 'class-validator';
export class CreateCategoriesProductDto {
  [x: string]: any;
  @IsNotEmpty()
  @IsObject()
  translationNameCategoryProduct: Record<string, any>;
  @IsOptional()
  urlImageCategory: string;
}
