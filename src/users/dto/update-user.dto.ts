import { PartialType } from '@nestjs/mapped-types';
import { CreateUserDto } from './create-user.dto';

export class UpdateUserDto extends PartialType(CreateUserDto) {
  firstName?: string | undefined;
  lastName?: string | undefined;
  username?: string | undefined;
  password?: string | undefined;
  email?: string | undefined;
}
