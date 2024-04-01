import { PartialType } from '@nestjs/swagger';
import { CreateProductDto } from './create-product.dto';
import { IsNotEmpty, IsOptional, IsObject } from 'class-validator';

export class UpdateProductDto extends PartialType(CreateProductDto) {
  @IsNotEmpty()
  nameProduct: string;
  descriptionProduct: string;
  category: string;
  link: string;
  status: string;
  @IsOptional()
  urlImageProduct: string;
  galleryImages: string;
  rejectedReason: string;
  @IsNotEmpty()
  @IsObject()
  translationDescriptionProduct: Record<string, any>;
  translationNameProduct: Record<string, any>;
}
