import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional, IsUrl, MaxLength } from 'class-validator';

export class CreateStationDto {
  @ApiProperty({
    minLength: 2,
    maxLength: 255,
    example: 'John',
  })
  @IsNotEmpty()
  name: string;

  @ApiProperty({
    example: 'https://www.example.com/stream',
  })
  @IsNotEmpty()
  @IsUrl()
  streamUrl: string;

  @ApiProperty({
    example: 'https://www.example.com/stream',
  })
  @IsOptional()
  @IsUrl()
  website: string;

  @ApiProperty({
    maxLength: 255,
    required: false,
    example: 'This is a description',
  })
  @IsOptional()
  @MaxLength(255)
  description?: string;

  @ApiProperty({
    maxLength: 255,
    required: false,
    example: 'rock',
  })
  @IsOptional()
  @MaxLength(255)
  genre?: string;

  @ApiProperty({
    maxLength: 255,
    required: false,
    example: 'New York',
  })
  @IsOptional()
  @MaxLength(255)
  location?: string;

  @ApiProperty({
    required: false,
  })
  @IsOptional()
  logo?: string;
}
