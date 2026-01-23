/**
 * Shared file output utility for data scripts
 *
 * Provides consistent output to the `data/` directory
 */

import { writeFileSync, mkdirSync, existsSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

// Resolve paths relative to this file's location
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Data directory is at project root: scripts/lib/../.. = project root
const DATA_DIR = join(__dirname, '..', '..', 'data');

/**
 * Write data to a JSON file in the data/ directory
 *
 * @param filename - The filename (e.g., 'balances.json')
 * @param data - The data to write (will be JSON stringified)
 */
export function writeDataFile(filename: string, data: unknown): void {
  const outputPath = join(DATA_DIR, filename);
  const dir = dirname(outputPath);

  // Ensure directory exists (handles nested paths like snapshots/)
  if (!existsSync(dir)) {
    mkdirSync(dir, { recursive: true });
  }

  writeFileSync(outputPath, JSON.stringify(data, null, 2));

  console.log(`\n✅ Data written to data/${filename}`);
}

/**
 * Get the full path to a file in the data/ directory
 *
 * @param filename - The filename
 * @returns The absolute path
 */
export function getDataFilePath(filename: string): string {
  return join(DATA_DIR, filename);
}
