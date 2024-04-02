import { PartialType } from '@nestjs/swagger';
import { CreateBrotherhoodDto } from './create-brotherhood.dto';
import { IsNotEmpty, IsOptional, IsObject } from 'class-validator';

export class UpdateBrotherhoodDto extends PartialType(CreateBrotherhoodDto) {
  @IsNotEmpty()
  nameBrotherhood: string;
  descriptionBrotherhood: string;
  category: string;
  link: string;
  status: string;
  @IsOptional()
  urlImageBrotherhood: string;
  galleryImagesBrotherhood: string;
  rejectedReason: string;
  @IsNotEmpty()
  @IsObject()
  translationName: Record<string, any>;
  translationDescription: Record<string, any>;
}
