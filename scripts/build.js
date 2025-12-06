const fs = require('fs');
const fsp = fs.promises;
const path = require('path');

async function removeDir(p) {
  try { await fsp.rm(p, { recursive: true, force: true }); } catch(e){}
}

async function copy(src, dest) {
  // use native cp when available
  if (fsp.cp) {
    await fsp.cp(src, dest, { recursive: true });
    return;
  }
  const stat = await fsp.stat(src);
  if (stat.isDirectory()) {
    await fsp.mkdir(dest, { recursive: true });
    const entries = await fsp.readdir(src);
    for (const e of entries) {
      await copy(path.join(src, e), path.join(dest, e));
    }
  } else {
    await fsp.copyFile(src, dest);
  }
}

async function build() {
  const root = path.resolve(__dirname, '..');
  const out = path.join(root, 'dist');
  console.log('Building static bundle to', out);
  await removeDir(out);
  await fsp.mkdir(out, { recursive: true });

  const entries = await fsp.readdir(root);
  const skip = new Set(['node_modules', 'dist', 'scripts']);
  for (const name of entries) {
    if (skip.has(name)) continue;
    const src = path.join(root, name);
    const dest = path.join(out, name);
    await copy(src, dest);
  }

  console.log('Build complete. Files copied to', out);
}

build().catch(err => {
  console.error(err);
  process.exit(1);
});
