import { ApiProperty } from '@nestjs/swagger';
import {
  IsEmail,
  IsNotEmpty,
  IsOptional,
  Matches,
  MaxLength,
  MinLength,
} from 'class-validator';

export class CreateUserDto {
  @ApiProperty({
    minLength: 2,
    maxLength: 50,
  })
  @IsNotEmpty()
  @MinLength(2)
  @MaxLength(50)
  firstName: string;

  @ApiProperty({
    minLength: 2,
    maxLength: 50,
  })
  @IsNotEmpty()
  @MinLength(2)
  @MaxLength(50)
  lastName: string;

  @ApiProperty({
    minLength: 2,
    maxLength: 50,
  })
  @IsNotEmpty()
  @MinLength(2)
  @MaxLength(50)
  username: string;

  @ApiProperty({
    minLength: 8,
    description:
      'The password must contain at least 8 characters, including at least one letter and one number.',
  })
  @IsNotEmpty()
  @MinLength(8)
  @Matches(/^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/, {
    message:
      'The password must contain at least 8 characters, including at least one letter and one number.',
  })
  password: string;

  @ApiProperty({
    maxLength: 100,
    required: false,
  })
  @IsOptional()
  @IsEmail()
  @MaxLength(100)
  email?: string;
}
