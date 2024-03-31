import { PartialType } from '@nestjs/swagger';
import { CreateCategoriesProductDto } from './create-categories-product.dto';
import { IsNotEmpty, IsOptional, IsObject } from 'class-validator';

export class UpdateCategoriesProductDto extends PartialType(
  CreateCategoriesProductDto,
) {
  @IsNotEmpty()
  @IsObject()
  translationNameCategoryProduct: Record<string, any>;
  @IsOptional()
  urlImageCategory: string;
}
