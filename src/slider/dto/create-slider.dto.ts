import { IsObject, IsOptional } from 'class-validator';

export class CreateSliderDto {
  [x: string]: any;
  name: string;
  @IsOptional()
  link: string;
  image: string;
  @IsOptional()
  @IsObject()
  message: Record<string, any>;
}
