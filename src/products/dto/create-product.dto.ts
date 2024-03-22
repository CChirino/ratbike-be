import { IsNotEmpty, IsOptional, IsObject } from 'class-validator';
export class CreateProductDto {
  [x: string]: any;
  @IsNotEmpty()
  nameProduct: string;
  descriptionProduct: string;
  category: string;
  link: string;
  @IsNotEmpty()
  createdBy: string;
  @IsOptional()
  urlImageProduct: string;
  galleryImages: string;
  @IsObject()
  languageDescriptionProduct: Record<string, any>;
  @IsObject()
  languageNameProduct: Record<string, any>;
}
