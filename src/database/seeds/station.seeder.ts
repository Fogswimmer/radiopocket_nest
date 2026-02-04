import { Station } from '@/stations/entities/station.entity';
import { DataSource } from 'typeorm';
import { Seeder, SeederFactoryManager } from 'typeorm-extension';

export class StationSeeder implements Seeder {
  public async run(
    dataSource: DataSource,
    factoryManager: SeederFactoryManager,
  ): Promise<any> {
    const stationFactory = factoryManager.get(Station);

    await stationFactory.saveMany(10);
  }
}
