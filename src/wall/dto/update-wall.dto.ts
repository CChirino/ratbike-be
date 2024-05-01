import { PartialType } from '@nestjs/swagger';
import { CreateWallDto } from './create-wall.dto';
import { IsNotEmpty, IsOptional, IsObject } from 'class-validator';

export class UpdateWallDto extends PartialType(CreateWallDto) {
  @IsNotEmpty()
  titleWall: string;

  @IsNotEmpty()
  descriptionWall: string;

  @IsNotEmpty()
  category: string;

  @IsNotEmpty()
  link: string;

  @IsNotEmpty()
  status: string;

  @IsOptional()
  urlImageWall: string;

  @IsNotEmpty()
  galleryImagesWall: string;

  @IsNotEmpty()
  rejectedReason: string;

  @IsNotEmpty()
  locationWall: string;
  @IsNotEmpty()
  startDateWall: Date;
  @IsNotEmpty()
  endDateWall: Date;

  @IsOptional()
  delete_at?: string;

  @IsOptional()
  delete_date?: Date;

  @IsNotEmpty()
  @IsObject()
  translation?: {
    translationTitleWall: Record<string, any>;
    translationDescriptionWall: Record<string, any>;
  };

  @IsNotEmpty()
  skills: string;
}
