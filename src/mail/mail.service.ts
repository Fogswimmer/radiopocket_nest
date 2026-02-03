import { MailerService } from '@nestjs-modules/mailer';
import { InjectQueue } from '@nestjs/bullmq';
import { Injectable, Logger } from '@nestjs/common';
import { Queue } from 'bullmq';

interface WelcomeMailDto {
  username: string;
  firstName: string;
  lastName: string;
  email: string;
}

@Injectable()
export class MailService {
  private readonly logger = new Logger(MailService.name);

  constructor(
    private readonly mailerService: MailerService,
    @InjectQueue('mail')
    private readonly mailQueue: Queue,
  ) {}

  async sendWelcomeMail(dto: WelcomeMailDto): Promise<void> {
    await this.mailQueue.add('welcome', dto, {
      attempts: 3,
      backoff: 5000,
      removeOnComplete: true,
    });
  }
}
