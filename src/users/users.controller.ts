import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseInterceptors,
  ParseIntPipe,
  UseGuards,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from '../auth/dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { UploadedFile } from '@nestjs/common';
import { User } from './entities/user.entity';
import { multerConfig } from 'src/config/multer.config';
import { FileValidationPipe } from 'src/common/validators/file-validation.pipe';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { CurrentUser } from 'src/common/decorators/current-user.decorator';

@Controller('users')
@UseGuards(JwtAuthGuard)
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get('me')
  getProfile(@CurrentUser() user: any) {
    return this.usersService.findOneById(user.id);
  }

  @Get()
  findAll(): Promise<User[]> {
    return this.usersService.findAll();
  }

  @Patch('me')
  updateProfile(
    @CurrentUser('id') userId: number,
    @Body() updateUserDto: UpdateUserDto,
  ) {
    return this.usersService.update(userId, updateUserDto);
  }

  @Delete('me')
  deleteProfile(@CurrentUser('id') userId: number) {
    return this.usersService.remove(userId);
  }

  @Post('me/avatar')
  @UseInterceptors(FileInterceptor('file', multerConfig))
  uploadAvatar(
    @CurrentUser('id') userId: number,
    @UploadedFile(new FileValidationPipe()) file: Express.Multer.File,
  ) {
    return this.usersService.uploadAvatar(userId, file);
  }
}
