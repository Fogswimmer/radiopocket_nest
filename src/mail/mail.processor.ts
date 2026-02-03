import { Processor, WorkerHost } from '@nestjs/bullmq';
import { Job } from 'bullmq';
import { MailerService } from '@nestjs-modules/mailer';

@Processor('mail')
export class MailProcessor extends WorkerHost {
  constructor(private readonly mailerService: MailerService) {
    super();
  }

  async process(job: Job) {
    switch (job.name) {
      case 'welcome':
        await this.mailerService.sendMail({
          to: job.data.email,
          subject: 'Добро пожаловать!',
          template: 'welcome',
          context: job.data,
        });
        break;
    }
  }
}
