import { IsNotEmpty, IsOptional, IsObject } from 'class-validator';
export class CreateBrotherhoodDto {
  [x: string]: any;
  @IsNotEmpty()
  nameBrotherhood: string;
  @IsNotEmpty()
  descriptionBrotherhood: string;
  @IsNotEmpty()
  category: string;
  @IsNotEmpty()
  link: string;
  status: string;
  createdBy: string;
  urlImageBrotherhood: string;
  galleryImagesBrotherhood: string;
  @IsOptional()
  @IsObject()
  translationName: Record<string, any>;
  @IsOptional()
  @IsObject()
  translationDescription: Record<string, any>;
}
