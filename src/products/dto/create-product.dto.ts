import { IsNotEmpty, IsOptional } from 'class-validator';
import { Decimal128 } from 'mongoose';

export class CreateProductDto {
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
