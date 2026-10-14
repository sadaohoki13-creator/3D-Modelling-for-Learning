import { readFile } from 'node:fs/promises';
import { createHash } from 'node:crypto';
import assert from 'node:assert/strict';
const manifest = JSON.parse(
  await readFile(new URL('../docs/assets/manifest.json', import.meta.url)),
);
for (const asset of manifest.assets) {
  const data = await readFile(new URL('../' + asset.path, import.meta.url));
  assert.equal(data.length, asset.bytes, `${asset.path}: byte count changed`);
  assert.equal(
    createHash('sha256').update(data).digest('hex'),
    asset.sha256,
    `${asset.path}: SHA-256 mismatch`,
  );
  if (asset.gitBlob)
    assert.equal(
      createHash('sha1').update(`blob ${data.length}\0`).update(data).digest('hex'),
      asset.gitBlob,
    );
  if (process.env.ASSET_BASE_URL) {
    const response = await fetch(new URL(asset.url, process.env.ASSET_BASE_URL));
    assert.equal(response.status, 200, `${asset.url}: HTTP failure`);
    assert.equal(
      createHash('sha256')
        .update(Buffer.from(await response.arrayBuffer()))
        .digest('hex'),
      asset.sha256,
    );
  }
}
console.log(
  `Verified ${manifest.assets.length} assets${process.env.ASSET_BASE_URL ? ' and served responses' : ''}.`,
);
