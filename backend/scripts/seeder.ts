import "dotenv/config";
import path from 'path';
import { connect as dbConnect } from '../modules/mongo';

const seederName = process.argv[2];

if (!seederName) {
  console.error('Please provide a seeder name.');
  process.exit(1);
}

async function runSeeder() {
  try {
    console.log('Connecting to database...');
    await dbConnect();
    console.log('Database connected.');

    const seederPath = path.resolve(__dirname, '../seeders', `${seederName}.ts`);
    console.log('Seeder path:', seederPath);

    const seeder = (await import(seederPath)).default;

    await seeder();
    console.log(`${seederName} has been seeded successfully.`);
    process.exit(0);
  } catch (error) {
    console.error(`Failed to run seeder: ${seederName}`, error);
    process.exit(1);
  }
}

runSeeder();
