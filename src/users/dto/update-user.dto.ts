import { PartialType } from '@nestjs/mapped-types';
import { CreateUserDto } from '../../auth/dto/create-user.dto';
import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsEmail, IsOptional, MaxLength } from 'class-validator';

export class UpdateUserDto extends PartialType(CreateUserDto) {
  @ApiProperty({
    minLength: 2,
    maxLength: 50,
    example: 'John',
  })
  @IsNotEmpty()
  firstName: string;

  @ApiProperty({
    minLength: 2,
    maxLength: 50,
    example: 'Doe',
  })
  @IsNotEmpty()
  lastName: string;

  @ApiProperty({
    maxLength: 100,
    required: false,
    example: 'john_doe@example.com',
  })
  @IsOptional()
  @IsEmail()
  @MaxLength(100)
  email?: string;
}
