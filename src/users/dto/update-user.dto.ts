import { PartialType } from '@nestjs/mapped-types';
import { CreateUserDto } from '../../auth/dto/create-user.dto';
import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty } from 'class-validator';

export class UpdateUserDto extends PartialType(CreateUserDto) {
  @ApiProperty({ minLength: 2, maxLength: 50 })
  @IsNotEmpty()
  firstName?: string | undefined;

  @ApiProperty({ minLength: 2, maxLength: 50 })
  @IsNotEmpty()
  lastName?: string | undefined;
}
