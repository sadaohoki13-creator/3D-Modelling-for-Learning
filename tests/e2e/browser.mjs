import { chromium as playwright } from '@playwright/test';
import chromium from '@sparticuz/chromium';
import { brotliDecompressSync } from 'node:zlib';
import { readFileSync, writeFileSync, mkdirSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join, dirname } from 'node:path';
import { createRequire } from 'node:module';
import { execFileSync } from 'node:child_process';
const require = createRequire(import.meta.url);
export async function browser() {
  if (process.platform !== 'linux' || process.arch !== 'x64') return playwright.launch();
  // Bundled test browser + its NSS libraries; no system-wide install is required.
  const root = dirname(require.resolve('@sparticuz/chromium/package.json'));
  const libs = join(tmpdir(), 'taarzan-browser-libs');
  mkdirSync(libs, { recursive: true });
  const tar = join(libs, 'al2023.tar');
  writeFileSync(tar, brotliDecompressSync(readFileSync(join(root, 'bin/al2023.tar.br'))));
  execFileSync('tar', ['xf', tar, '-C', libs]);
  return playwright.launch({
    executablePath: await chromium.executablePath(),
    args: chromium.args.filter((a) => a !== '--single-process'),
    headless: true,
    env: {
      ...process.env,
      LD_LIBRARY_PATH:
        join(libs, 'lib') + (process.env.LD_LIBRARY_PATH ? ':' + process.env.LD_LIBRARY_PATH : ''),
    },
  });
}
