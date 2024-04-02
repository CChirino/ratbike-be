import { PartialType } from '@nestjs/swagger';
import { CreateCategoriesBrotherhoodDto } from './create-categories-brotherhood.dto';
import { IsNotEmpty, IsOptional, IsObject } from 'class-validator';

export class UpdateCategoriesBrotherhoodDto extends PartialType(
  CreateCategoriesBrotherhoodDto,
) {
  @IsNotEmpty()
  @IsObject()
  translationNameCategoryBrotherhood: Record<string, any>;
  @IsOptional()
  urlImageCategoryBrotherhood: string;
}
