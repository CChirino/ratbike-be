import { IsNotEmpty, IsOptional, IsObject } from 'class-validator';
export class CreateProductDto {
  [x: string]: any;
  @IsNotEmpty()
  nameProduct: string;
  descriptionProduct: string;
  category: string;
  link: string;
  status: string;
  @IsNotEmpty()
  createdBy: string;
  @IsOptional()
  urlImageProduct: string;
  galleryImages: string;
  @IsObject()
  translationDescriptionProduct: Record<string, any>;
  @IsObject()
  translationNameProduct: Record<string, any>;
}
