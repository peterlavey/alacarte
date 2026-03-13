import fs from 'fs/promises';
import path from 'path';
import santiagoRestaurants from './santiago_data.js';

const targetPath = path.join(process.cwd(), 'server', 'repositories', 'storage', 'santiago_restaurants.json');

async function generate() {
  const records = santiagoRestaurants.map(r => ({
    lat: r.lat,
    lon: r.lon,
    content: r.content,
    createdAt: new Date().toISOString()
  }));

  try {
    await fs.writeFile(targetPath, JSON.stringify(records, null, 2), 'utf-8');
    console.log(`Generated ${records.length} records in ${targetPath}`);
  } catch (error) {
    console.error('Error generating Santiago data:', error);
    process.exit(1);
  }
}

generate();
