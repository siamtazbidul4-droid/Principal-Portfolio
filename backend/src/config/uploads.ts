import path from 'path';

/**
 * Absolute directory where uploaded images are stored and served from.
 *
 * Defaults to `<repo-root>/backend/data/uploads` (existing behavior).
 * Can be overridden with the `UPLOADS_DIR` environment variable so a
 * Render Persistent Disk mount path can be used in production without
 * changing code (e.g. `UPLOADS_DIR=/var/data/uploads`).
 */
export function getUploadsDir(): string {
  const override = (process.env.UPLOADS_DIR || '').trim();
  if (override) return path.resolve(override);
  return path.join(process.cwd(), 'backend', 'data', 'uploads');
}
