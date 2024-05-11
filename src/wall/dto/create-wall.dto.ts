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
  @IsNotEmpty()
  status: string;
  @IsNotEmpty()
  createdBy: string;
  @IsNotEmpty()
  galleryImagesWall: string;
  @IsNotEmpty()
  startHourWall: string;
  @IsNotEmpty()
  endHourWall: string;
  @IsNotEmpty()
  startDateWall: Date;
  @IsNotEmpty()
  endDateWall: Date;
  @IsNotEmpty()
  locationWall: string;
  @IsNotEmpty()
  cityWall: string;
  @IsNotEmpty()
  startHour: string;
  @IsNotEmpty()
  endHour: string;
  @IsNotEmpty()
  skillWall: string;
  @IsOptional()
  @IsObject()
  translationTitleWall: Record<string, any>;
  @IsOptional()
  @IsObject()
  translationDescriptionWall: Record<string, any>;
}
