const fs = require('fs').promises;
const path = require('path');

const dest = path.join(__dirname, '..', 'dist');

(async () => {
  try {
    await fs.rm(dest, { recursive: true, force: true });
    console.log('Clean complete — removed', dest);
  } catch (err) {
    console.error('Clean failed:', err);
    process.exitCode = 1;
  }
})();
