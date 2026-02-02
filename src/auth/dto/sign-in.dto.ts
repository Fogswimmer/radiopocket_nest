import { ApiProperty } from '@nestjs/swagger';

export class SignInDto {
  @ApiProperty({ minLength: 2, maxLength: 50 })
  username: string;

  @ApiProperty({ minLength: 8 })
  password: string;
}
