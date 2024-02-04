import { PartialType } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional } from 'class-validator';
import { LoginAuthDto } from './login-auth.dto';

export class RegisterAuthDto extends PartialType(LoginAuthDto) {
  @IsNotEmpty()
  name: string;
  lastname: string;
  email: string;
  password: string;
  questionSecurity: string;
  answerSecurity: string;
  terms: boolean;
  @IsOptional()
  urlProfileImage: string;
}
