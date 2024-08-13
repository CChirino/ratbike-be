import { IsNotEmpty, IsOptional } from 'class-validator';

export class CreateSliderDto {
  @IsOptional()
  name: string;
  @IsOptional()
  link: string;
  @IsNotEmpty()
  image1: string;
  @IsNotEmpty()
  image2: string;
  @IsNotEmpty()
  image3: string;
}
