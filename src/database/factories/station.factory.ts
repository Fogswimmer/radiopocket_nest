import { setSeederFactory } from 'typeorm-extension';
import { Faker } from '@faker-js/faker';
import { Station } from '@/stations/entities/station.entity';

export default setSeederFactory(Station, (faker: Faker) => {
  const station = new Station();
  station.name = faker.company.name();
  station.streamUrl = faker.internet.url();
  station.website = faker.internet.url();
  station.description = faker.lorem.sentence();
  station.genre = faker.lorem.word();
  station.location = faker.location.city();
  station.logo = faker.image.avatar();

  return station;
});
