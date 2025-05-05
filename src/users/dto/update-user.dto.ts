import { IsOptional, IsEmail, IsString, MinLength, MaxLength } from 'class-validator';

export class UpdateUserDto {
  @IsOptional()
  @IsEmail()
  email?: string;

  @IsOptional()
  @IsString()
  @MinLength(6)
  @MaxLength(20)
  password?: string;

  @IsOptional()
  @IsString()
  role?: string;
}
