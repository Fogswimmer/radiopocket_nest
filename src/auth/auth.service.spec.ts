import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { JwtService } from '@nestjs/jwt';
import { MailService } from '../mail/mail.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { ConflictException, UnauthorizedException } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { User } from '@/users/entities/user.entity';

describe('AuthService', () => {
  let service: AuthService;

  let repo: jest.Mocked<Repository<User>>;
  let jwtService: jest.Mocked<JwtService>;
  let mailService: jest.Mocked<MailService>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        {
          provide: getRepositoryToken(User),
          useValue: {
            findOne: jest.fn(),
            create: jest.fn(),
            save: jest.fn(),
          },
        },
        {
          provide: JwtService,
          useValue: {
            signAsync: jest.fn(),
          },
        },
        {
          provide: MailService,
          useValue: {
            sendWelcomeMail: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get(AuthService);

    repo = module.get(getRepositoryToken(User));
    jwtService = module.get(JwtService);
    mailService = module.get(MailService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  // -------------------------------------------------
  // REGISTER
  // -------------------------------------------------

  describe('register', () => {
    it('creates user and returns token', async () => {
      const dto = {
        username: 'john',
        password: '12345678a',
        firstName: 'John',
        lastName: 'Doe',
        email: 'john@mail.com',
      };

      repo.findOne.mockResolvedValueOnce(null); // username free
      repo.findOne.mockResolvedValueOnce(null); // email free

      repo.create.mockReturnValue({
        id: 1,
        ...dto,
        passwordHash: 'hash',
      } as any);
      repo.save.mockResolvedValue({
        id: 1,
        ...dto,
        passwordHash: 'hash',
      } as any);

      jwtService.signAsync.mockResolvedValue('jwt-token');

      jest.spyOn(bcrypt, 'hash').mockResolvedValue('hash' as never);

      const result = await service.register(dto as any);

      expect(repo.create).toHaveBeenCalled();
      expect(repo.save).toHaveBeenCalled();
      expect(mailService.sendWelcomeMail).toHaveBeenCalled();
      expect(result.access_token).toBe('jwt-token');
    });

    it('throws if username exists', async () => {
      repo.findOne.mockResolvedValue({ id: 1 } as User);

      await expect(
        service.register({ username: 'taken' } as any),
      ).rejects.toThrow(ConflictException);
    });

    it('throws if email exists', async () => {
      repo.findOne
        .mockResolvedValueOnce(null) // username ok
        .mockResolvedValueOnce({ id: 2 } as User); // email exists

      await expect(
        service.register({ username: 'john', email: 'dup@mail.com' } as any),
      ).rejects.toThrow(ConflictException);
    });
  });

  // -------------------------------------------------
  // SIGN IN
  // -------------------------------------------------

  describe('signIn', () => {
    it('returns token on success login', async () => {
      const user = {
        id: 1,
        username: 'john',
        passwordHash: 'hash',
      } as User;

      repo.findOne.mockResolvedValue(user);
      repo.save.mockResolvedValue(user);

      jwtService.signAsync.mockResolvedValue('jwt-token');

      jest.spyOn(bcrypt, 'compare').mockResolvedValue(true as never);

      const result = await service.signIn({
        username: 'john',
        password: '123',
      } as any);

      expect(result.access_token).toBe('jwt-token');
      expect(repo.save).toHaveBeenCalled();
    });

    it('throws if user not found', async () => {
      repo.findOne.mockResolvedValue(null);

      await expect(
        service.signIn({ username: 'nope', password: '123' } as any),
      ).rejects.toThrow(UnauthorizedException);
    });

    it('throws if password wrong', async () => {
      repo.findOne.mockResolvedValue({ passwordHash: 'hash' } as User);

      jest.spyOn(bcrypt, 'compare').mockResolvedValue(false as never);

      await expect(
        service.signIn({ username: 'john', password: 'bad' } as any),
      ).rejects.toThrow(UnauthorizedException);
    });
  });

  // -------------------------------------------------
  // LOGOUT
  // -------------------------------------------------

  describe('logOut', () => {
    it('returns null token', async () => {
      const result = await service.logOut();
      expect(result.access_token).toBeNull();
    });
  });
});
