import { PartialType } from '@nestjs/swagger';
import { CreateCategoriesProductDto } from './create-categories-product.dto';

export class UpdateCategoriesProductDto extends PartialType(
  CreateCategoriesProductDto,
) {}
