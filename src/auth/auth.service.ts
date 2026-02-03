import {
  ConflictException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from 'src/users/users.service';
import * as bcrypt from 'bcrypt';
import { SignInDto } from './dto/sign-in.dto';
import { CreateUserDto } from 'src/auth/dto/create-user.dto';
import { User } from 'src/users/entities/user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
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

    await this.usersRepository.save(user);

    const payload = { sub: user.id, username: user.username };

    return {
      access_token: await this.jwtService.signAsync(payload),
    };
  }

  async signIn(signInDto: SignInDto): Promise<any> {
    const user = await this.usersService.findOneWithPassword(
      signInDto.username,
    );

    if (!user) {
      throw new UnauthorizedException();
    }

    const isMatch = await bcrypt.compare(signInDto.password, user.passwordHash);

    if (!isMatch) {
      throw new UnauthorizedException();
    }

    const payload = { sub: user.id, username: user.username };

    return {
      access_token: await this.jwtService.signAsync(payload),
    };
  }

  async logOut(): Promise<any> {
    return {
      access_token: null,
    };
  }
}
