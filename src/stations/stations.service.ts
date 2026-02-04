import { Injectable } from '@nestjs/common';
import { CreateStationDto } from './dto/create-station.dto';
import { UpdateStationDto } from './dto/update-station.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Station } from './entities/station.entity';
import { Repository } from 'typeorm';

@Injectable()
export class StationsService {
  constructor(
    @InjectRepository(Station)
    private readonly repository: Repository<Station>,
  ) {}

  async create(createStationDto: CreateStationDto): Promise<Station> {
    return this.repository.save(createStationDto);
  }

  async findAll(): Promise<Station[]> {
    return this.repository.find();
  }

  async findOneBySlug(slug: string): Promise<Station | null> {
    return this.repository.findOneBy({ slug });
  }

  async update(id: number, updateStationDto: UpdateStationDto): Promise<any> {
    return this.repository.update(id, updateStationDto);
  }

  async remove(id: number): Promise<any> {
    return this.repository.delete(id);
  }
}
