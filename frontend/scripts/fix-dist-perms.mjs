import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const dist = path.join(path.dirname(fileURLToPath(import.meta.url)), '..', 'dist');

function fix(dir) {
  if (!fs.existsSync(dir)) return;
  try { fs.chmodSync(dir, 0o755); } catch { /* Windows / unsupported */ }
  for (const ent of fs.readdirSync(dir, { withFileTypes: true })) {
    const p = path.join(dir, ent.name);
    if (ent.isDirectory()) fix(p);
    else try { fs.chmodSync(p, 0o644); } catch { /* ignore */ }
  }
}

fix(dist);
console.log('✅ dist permissions: dirs 755, files 644');
