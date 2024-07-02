import { IsNotEmpty, IsOptional } from 'class-validator';

export class CreateUserDto {
  @IsNotEmpty()
  name: string;
  @IsNotEmpty()
  lastname: string;
  @IsNotEmpty()
  email: string;
  @IsNotEmpty()
  password: string;
  @IsOptional()
  city: string;
}
