const fs = require('fs').promises;
const path = require('path');

const root = path.join(__dirname, '..');
const src = path.join(root, 'frontend');
const dest = path.join(root, 'dist');

async function copyDir(srcDir, destDir) {
  await fs.mkdir(destDir, { recursive: true });
  const entries = await fs.readdir(srcDir, { withFileTypes: true });
  for (const entry of entries) {
    const srcPath = path.join(srcDir, entry.name);
    const destPath = path.join(destDir, entry.name);
    if (entry.isDirectory()) {
      await copyDir(srcPath, destPath);
    } else if (entry.isFile()) {
      await fs.copyFile(srcPath, destPath);
    }
  }
}

(async () => {
  try {
    await fs.rm(dest, { recursive: true, force: true });
    await copyDir(src, dest);
    console.log('Build complete — files copied to', dest);
  } catch (err) {
    console.error('Build failed:', err);
    process.exitCode = 1;
  }
})();
