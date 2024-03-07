import { PartialType } from '@nestjs/swagger';
import { CreateProductDto } from './create-product.dto';
import { IsNotEmpty, IsOptional } from 'class-validator';

export class UpdateProductDto extends PartialType(CreateProductDto) {
  @IsNotEmpty()
  nameProduct: string;
  descriptionProduct: string;
  category: string;
  link: string;
  @IsOptional()
  urlImageProduct: string;
}
