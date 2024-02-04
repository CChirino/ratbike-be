export class ResetPasswordDto {
  email: string;
  password: string;
  resetPasswordToken?: string;
  resetPasswordExpires?: number;
}
