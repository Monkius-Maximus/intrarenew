#!/usr/bin/env node
/**
 * Data migration script
 * Usage: node migrate-data.js --input data.json
 */

const fs = require('fs');

const args = process.argv.slice(2);
const inputIdx = args.indexOf('--input');

if (inputIdx === -1) {
  console.log('Usage: node migrate-data.js --input <data.json>');
  console.log('\nThis script imports data from a JSON file into the intranet database via the API.');
  console.log('Make sure the backend is running before executing this script.');
  process.exit(0);
}

const inputFile = args[inputIdx + 1];

async function main() {
  const baseUrl = process.env.API_URL || 'http://localhost:3000';
  const token = process.env.ADMIN_TOKEN || '';

  const data = JSON.parse(fs.readFileSync(inputFile, 'utf-8'));

  const headers = {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${token}`,
  };

  let imported = 0;

  for (const resource of ['employees', 'announcements', 'links']) {
    const items = data[resource] || [];
    for (const item of items) {
      const res = await fetch(`${baseUrl}/api/${resource}`, {
        method: 'POST',
        headers,
        body: JSON.stringify(item),
      });
      if (res.ok) {
        imported++;
        console.log(`Imported ${resource}: ${item.name || item.title}`);
      } else {
        console.error(`Failed to import ${resource}: ${JSON.stringify(item)}`);
      }
    }
  }

  console.log(`\nMigration complete. ${imported} records imported.`);
}

main().catch(console.error);
