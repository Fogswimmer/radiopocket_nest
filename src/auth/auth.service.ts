import {
  ConflictException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { SignInDto } from './dto/sign-in.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '@/users/entities/user.entity';

import { MailService } from '@/mail/mail.service';
import { CreateUserDto } from './dto/create-user.dto';

@Injectable()
export class AuthService {
  constructor(
    private jwtService: JwtService,
    private mailService: MailService,
    @InjectRepository(User)
    private readonly usersRepository: Repository<User>,
  ) {}

  async register(dto: CreateUserDto): Promise<any> {
    const exists = await this.usersRepository.findOne({
      where: { username: dto.username },
    });

    if (exists) {
      throw new ConflictException('User with the same username already exists');
    }

    const hash = await bcrypt.hash(dto.password, 10);
    const user = this.usersRepository.create({
      ...dto,
      passwordHash: hash,
    });

    if (dto.email) {
      const exists = await this.usersRepository.findOne({
        where: { email: dto.email },
      });

      if (exists) {
        throw new ConflictException('User with the same email already exists');
      }

      await this.mailService.sendWelcomeMail({
        username: user.username,
        firstName: user.firstName,
        lastName: user.lastName,
        email: dto.email,
      });
    }

    await this.usersRepository.save(user);

    const payload = { sub: user.id, username: user.username };

    return {
      access_token: await this.jwtService.signAsync(payload),
      ...user,
    };
  }

  async signIn(signInDto: SignInDto): Promise<any> {
    const user = await this.usersRepository.findOne({
      where: { username: signInDto.username },
    });

    if (!user) {
      throw new UnauthorizedException();
    }

    const isMatch = await bcrypt.compare(signInDto.password, user.passwordHash);

    if (!isMatch) {
      throw new UnauthorizedException();
    }

    user.lastLogin = new Date();
    await this.usersRepository.save(user);

    const payload = { sub: user.id, username: user.username };

    return {
      access_token: await this.jwtService.signAsync(payload),
      last_login: user.lastLogin,
    };
  }

  async logOut(): Promise<any> {
    return {
      access_token: null,
    };
  }
}
