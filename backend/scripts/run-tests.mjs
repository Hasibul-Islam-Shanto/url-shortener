import { readdir } from 'node:fs/promises';
import { spawn } from 'node:child_process';
import path from 'node:path';

const testFiles = await findTestFiles(path.resolve('src'));

if (testFiles.length === 0) {
  console.error('No test files found');
  process.exit(1);
}

const child = spawn(process.execPath, ['--import', 'tsx', '--test', ...testFiles, ...process.argv.slice(2)], {
  stdio: 'inherit',
  env: {
    ...process.env,
    NODE_ENV: process.env.NODE_ENV ?? 'test',
    MONGODB_URI: process.env.MONGODB_URI ?? 'mongodb://localhost:27017/url-shortener-test',
    JWT_SECRET: process.env.JWT_SECRET ?? 'test-secret-at-least-32-characters-long',
  },
});

child.on('exit', (code, signal) => {
  if (signal) {
    process.kill(process.pid, signal);
    return;
  }

  process.exit(code ?? 1);
});

async function findTestFiles(dir) {
  const entries = await readdir(dir, { withFileTypes: true });
  const files = await Promise.all(
    entries.map(async (entry) => {
      const fullPath = path.join(dir, entry.name);

      if (entry.isDirectory()) {
        return findTestFiles(fullPath);
      }

      return entry.isFile() && entry.name.endsWith('.test.ts') ? [fullPath] : [];
    }),
  );

  return files.flat().sort();
}
