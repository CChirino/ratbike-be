import { IsNotEmpty, IsOptional } from 'class-validator';
export class CreateProductDto {
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
}
