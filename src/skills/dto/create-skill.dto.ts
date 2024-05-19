import { IsNotEmpty, IsOptional, IsObject } from 'class-validator';

export class CreateSkillDto {
  [x: string]: any;
  @IsNotEmpty()
  titleSkill: string;
  @IsNotEmpty()
  descriptionSkill: string;
  @IsNotEmpty()
  category: string;
  @IsNotEmpty()
  link: string;
  @IsNotEmpty()
  status: string;
  @IsNotEmpty()
  createdBy: string;
  @IsNotEmpty()
  galleryImagesSkill: string;
  @IsNotEmpty()
  startHourSkill: string;
  @IsNotEmpty()
  endHourWall: string;
  @IsNotEmpty()
  startDateSkill: Date;
  @IsNotEmpty()
  endDateSkill: Date;
  @IsNotEmpty()
  locationSkill: string;
  @IsNotEmpty()
  citySkill: string;
  @IsNotEmpty()
  startHour: string;
  @IsNotEmpty()
  endHour: string;
  @IsOptional()
  @IsObject()
  translationTitleSkill: Record<string, any>;
  @IsOptional()
  @IsObject()
  translationDescriptionSkill: Record<string, any>;
}
