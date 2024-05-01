import { IsNotEmpty, IsOptional, IsObject } from 'class-validator';
export class CreateWallDto {
  [x: string]: any;
  @IsNotEmpty()
  titleWall: string;
  @IsNotEmpty()
  descriptionWall: string;
  @IsNotEmpty()
  category: string;
  @IsNotEmpty()
  link: string;
  status: string;
  createdBy: string;
  urlImageWall: string;
  galleryImagesWall: string;
  @IsNotEmpty()
  startHourWall: string;
  endHourWall: string;
  startDateWall: Date;
  endDateWall: Date;
  @IsOptional()
  @IsObject()
  translationTitleWall: Record<string, any>;
  @IsOptional()
  @IsObject()
  translationDescriptionWall: Record<string, any>;
}
