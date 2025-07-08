import { DataSource } from 'typeorm';
import { seedDatabase } from './seeds/seed';
import { User } from '../modules/users/entities/user.entity';
import { Matter } from '../modules/matters/entities/matter.entity';
import { Contract } from '../modules/contracts/entities/contract.entity';

const dataSource = new DataSource({
  type: 'postgres',
  host: process.env.DATABASE_HOST || 'localhost',
  port: parseInt(process.env.DATABASE_PORT) || 5432,
  username: process.env.DATABASE_USERNAME || 'counselflow',
  password: process.env.DATABASE_PASSWORD || 'secure_password_123',
  database: process.env.DATABASE_NAME || 'counselflow_ultimate',
  entities: [User, Matter, Contract],
  synchronize: true,
  logging: false,
});

async function runSeed() {
  try {
    console.log('📦 Connecting to database...');
    await dataSource.initialize();
    console.log('✅ Database connected successfully');

    await seedDatabase(dataSource);

    await dataSource.destroy();
    console.log('👋 Database connection closed');
  } catch (error) {
    console.error('❌ Error during seeding:', error);
    process.exit(1);
  }
}

runSeed();