import { IsNotEmpty, IsOptional, IsObject } from 'class-validator';

export class CreateCategoriesBrotherhoodDto {
  [x: string]: any;
  @IsNotEmpty()
  @IsObject()
  translationNameCategoryBrotherhood: Record<string, any>;
  @IsOptional()
  urlImageCategoryBrotherhood: string;
}
