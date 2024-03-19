import { IsNotEmpty, IsOptional } from 'class-validator';
export class CreateCategoriesProductDto {
  @IsNotEmpty()
  nameCategoryProduct: string;
  descriptionCategoryProduct: string;
  @IsOptional()
  urlImageCategory: string;
}
