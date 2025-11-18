const { cpSync, existsSync } = require('node:fs');
const { resolve } = require('node:path');

const source = resolve(__dirname, '../src/generated/prisma');
const destination = resolve(__dirname, '../dist/generated/prisma');

if (existsSync(source)) {
  cpSync(source, destination, { recursive: true });
  console.log('Copied Prisma client assets to dist.');
} else {
  console.warn('Prisma client assets not found, skipping copy.');
}
