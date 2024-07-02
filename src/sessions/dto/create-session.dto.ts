import { IsNotEmpty, IsOptional, isNotEmpty } from 'class-validator';

export class CreateSessionDto {
  @IsNotEmpty()
  userId: string;
  @IsNotEmpty()
  latitude: string;
  @IsNotEmpty()
  longitude: string;
  @IsNotEmpty()
  country: string;
  @IsNotEmpty()
  name: string;
  @IsNotEmpty()
  lastname: string;
  @IsOptional()
  vocation?: string;
  @IsNotEmpty()
  email: string;
  @IsNotEmpty()
  urlProfileImage: string;
  @IsOptional()
  city: string;
}
