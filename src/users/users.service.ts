import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateUserDto } from '../auth/dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity';
import * as bcrypt from 'bcrypt';
import { InjectRepository } from '@nestjs/typeorm';
import * as fs from 'fs/promises';
import * as path from 'path';
import * as fsSync from 'fs';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly usersRepository: Repository<User>,
  ) {}

  async findAll(): Promise<User[]> {
    return this.usersRepository.find();
  }

  async findOne(username: string): Promise<User | null> {
    return this.usersRepository.findOneBy({ username });
  }

  async findOneWithPassword(username: string) {
    return this.usersRepository
      .createQueryBuilder('user')
      .addSelect('user.passwordHash')
      .where('user.username = :username', { username })
      .getOne();
  }

  async findOneById(id: number): Promise<User | null> {
    return this.usersRepository.findOneBy({ id });
  }

  async update(id: number, updateUserDto: UpdateUserDto): Promise<any> {
    return this.usersRepository.update(id, updateUserDto);
  }

  async remove(id: number): Promise<any> {
    return this.usersRepository.delete(id);
  }

  async uploadAvatar(id: number, file: Express.Multer.File): Promise<User> {
    const user = await this.usersRepository.findOne({ where: { id } });

    if (!user) {
      await fs.unlink(file.path);
      throw new NotFoundException('User not found');
    }

    const avatarDir = path.join('./uploads/avatars', user.id.toString());

    if (!fsSync.existsSync(avatarDir)) {
      await fs.mkdir(avatarDir, { recursive: true });
    }

    const avatarPath = path.join(avatarDir, file.filename);

    await fs.rename(file.path, avatarPath);

    if (user.avatar) {
      const oldAvatarPath = path.join('./uploads', user.avatar);
      try {
        await fs.unlink(oldAvatarPath);
      } catch (error) {
        console.error('Error deleting old avatar:', error);
      }
    }

    user.avatar = `/uploads/avatars/${user.id}/${file.filename}`;

    return this.usersRepository.save(user);
  }
}
