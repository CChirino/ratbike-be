import { PartialType } from '@nestjs/swagger';
import { CreateProductDto } from './create-product.dto';
import { IsNotEmpty, IsOptional } from 'class-validator';
import { Decimal128 } from 'mongoose';

export class UpdateProductDto extends PartialType(CreateProductDto) {
  @IsNotEmpty()
  nameProduct: string;
  descriptionProduct: string;
  sku: string;
  category: string;
  price: Decimal128;
  currency: string;
  terms: boolean;
  @IsOptional()
  urlImageProduct: string;
}
