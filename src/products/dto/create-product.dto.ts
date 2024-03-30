import { IsNotEmpty, IsOptional, IsObject } from 'class-validator';
export class CreateProductDto {
  [x: string]: any;
  @IsNotEmpty()
  nameProduct: string;
  @IsNotEmpty()
  descriptionProduct: string;
  @IsNotEmpty()
  category: string;
  @IsNotEmpty()
  link: string;
  status: string;
  createdBy: string;
  urlImageProduct: string;
  galleryImages: string;
  @IsOptional()
  @IsObject()
  translationDescriptionProduct: Record<string, any>;
  @IsOptional()
  @IsObject()
  translationNameProduct: Record<string, any>;
}
