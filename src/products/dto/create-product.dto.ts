import { IsNotEmpty, IsOptional, IsObject } from 'class-validator';
export class CreateProductDto {
  [x: string]: any;
  @IsNotEmpty()
  nameProduct: string;
  descriptionProduct: string;
  category: string;
  link: string;
  status: string;
  createdBy: string;
  @IsOptional()
  urlImageProduct: string;
  galleryImages: string;
  @IsOptional()
  @IsObject()
  translationDescriptionProduct: Record<string, any>;
  translationNameProduct: Record<string, any>;
}
