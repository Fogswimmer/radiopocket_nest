import { Seeder, SeederFactoryManager } from 'typeorm-extension';
import { DataSource } from 'typeorm';
import { User } from '@/users/entities/user.entity';
import * as bcrypt from 'bcrypt';
import { UserRole } from '@/users/enums/user-role.enum';

export class UserSeeder implements Seeder {
  public async run(
    dataSource: DataSource,
    factoryManager: SeederFactoryManager,
  ): Promise<any> {
    const repository = dataSource.getRepository(User);
    await repository.insert([
      {
        firstName: 'Admin',
        lastName: 'Admin',
        email: 'admin@radiopocket.com',
        username: 'admin',
        role: UserRole.ADMIN,
        passwordHash: await bcrypt.hash('admin123', 10),
      },
    ]);
  }
}
