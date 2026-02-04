import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Delete,
  UseInterceptors,
  UseGuards,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { UpdateUserDto } from './dto/update-user.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { UploadedFile } from '@nestjs/common';
import { User } from './entities/user.entity';

import { ApiBearerAuth, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { JwtAuthGuard } from '@/auth/guards/jwt-auth.guard';
import { Public } from '@/common/decorators/public.decorator';
import { CurrentUser } from '@/common/decorators/current-user.decorator';
import { multerConfig } from '@/config/multer.config';
import { FileValidationPipe } from '@/common/validators/file-validation.pipe';

@Controller('users')
@UseGuards(JwtAuthGuard)
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get()
  @ApiOperation({ summary: 'Find all users' })
  @ApiResponse({ status: 200, description: 'List of users' })
  @Public()
  async findAll(): Promise<User[]> {
    return await this.usersService.findAll();
  }

  @Get('me')
  @ApiOperation({ summary: 'Get user profile' })
  @ApiResponse({ status: 200, description: 'User profile' })
  @ApiBearerAuth()
  async getProfile(@CurrentUser() user: User): Promise<User | null> {
    return await this.usersService.findOneById(user.id);
  }

  @Patch('me')
  @ApiOperation({ summary: 'Update user profile' })
  @ApiResponse({ status: 200, description: 'User profile updated' })
  @ApiBearerAuth()
  async updateProfile(
    @CurrentUser('id') userId: number,
    @Body() updateUserDto: UpdateUserDto,
  ): Promise<User> {
    return await this.usersService.update(userId, updateUserDto);
  }

  @Post('me/avatar')
  @ApiOperation({ summary: 'Upload avatar' })
  @ApiResponse({ status: 200, description: 'Avatar uploaded' })
  @ApiBearerAuth()
  @UseInterceptors(FileInterceptor('file', multerConfig))
  async uploadAvatar(
    @CurrentUser('id') userId: number,
    @UploadedFile(new FileValidationPipe()) file: Express.Multer.File,
  ) {
    return await this.usersService.uploadAvatar(userId, file);
  }

  @Delete('me')
  @ApiOperation({ summary: 'Delete user profile' })
  @ApiResponse({ status: 200, description: 'User profile deleted' })
  @ApiBearerAuth()
  async deleteProfile(@CurrentUser('id') userId: number) {
    return await this.usersService.remove(userId);
  }
}
