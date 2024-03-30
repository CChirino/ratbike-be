import { IsNotEmpty, IsOptional } from 'class-validator';
export class CreateCategoriesProductDto {
  @IsNotEmpty()
  nameCategoryProduct: string;
  @IsOptional()
  urlImageCategory: string;
}
