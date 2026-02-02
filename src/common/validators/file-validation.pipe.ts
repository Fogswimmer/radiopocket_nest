import { PipeTransform, Injectable, BadRequestException } from '@nestjs/common';

@Injectable()
export class FileValidationPipe implements PipeTransform {
  constructor(
    private readonly maxSize: number = 5 * 1024 * 1024,
    private readonly allowedMimeTypes: string[] = [
      'image/jpeg',
      'image/png',
      'image/webp',
    ],
  ) {}

  transform(file: Express.Multer.File) {
    if (!file) {
      throw new BadRequestException('File not found');
    }

    if (!this.allowedMimeTypes.includes(file.mimetype)) {
      throw new BadRequestException('Ivalid format. Allowed: JPG, PNG, WEBP');
    }

    if (file.size > this.maxSize) {
      throw new BadRequestException(
        `The file is too large. Max size: ${this.maxSize / 1024 / 1024}MB`,
      );
    }

    return file;
  }
}
