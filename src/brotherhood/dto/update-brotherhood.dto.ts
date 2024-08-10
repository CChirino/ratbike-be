import { PartialType } from '@nestjs/swagger';
import { CreateBrotherhoodDto } from './create-brotherhood.dto';
import { IsNotEmpty, IsOptional, IsObject } from 'class-validator';

export class UpdateBrotherhoodDto extends PartialType(CreateBrotherhoodDto) {
  @IsOptional()
  nameBrotherhood: string;
  @IsOptional()
  descriptionBrotherhood: string;
  @IsOptional()
  category: string;
  @IsOptional()
  link: string;
  @IsOptional()
  status: string;
  @IsOptional()
  urlImageBrotherhood: string;
  @IsOptional()
  galleryImagesBrotherhood: string;
  @IsOptional()
  rejectedReason: string;
  @IsOptional()
  @IsObject()
  translationName: Record<string, any>;
  translationDescription: Record<string, any>;
}
