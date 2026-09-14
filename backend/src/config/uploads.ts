import fs from 'fs';
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

/**
 * Whether uploads are being written to the process-local (ephemeral) filesystem
 * instead of an explicitly-mounted persistent disk. On container hosts such as
 * Render the default `backend/data/uploads` path lives in the container image,
 * so uploaded files are lost on every restart/redeploy — the database record and
 * its `/uploads/...` path survive, but the bytes do not, which surfaces as images
 * that load immediately after upload and then break after a refresh. See
 * `warnIfUploadsAreEphemeral()` for the boot-time guard built on this predicate.
 */
export function isUploadsEphemeral(): boolean {
  return !(process.env.UPLOADS_DIR || '').trim();
}

/**
 * Emit a single, loud boot-time diagnostic when production uploads would be
 * written to the ephemeral container filesystem. Mirrors the existing
 * warn-on-misconfiguration convention in `config/env.ts` (which warns for a
 * missing CORS_ORIGINS): the app still boots, but the operator is told exactly
 * what to fix instead of silently losing every uploaded image on the next
 * restart. Also verifies the configured directory is writable so a bad disk
 * mount path fails visibly at boot rather than on the first upload.
 */
export function warnIfUploadsAreEphemeral(): void {
  const dir = getUploadsDir();

  if (process.env.NODE_ENV === 'production' && isUploadsEphemeral()) {
    console.warn(
      '[Uploads] WARNING: UPLOADS_DIR is not set in production — uploaded images are being ' +
        'written to the ephemeral container filesystem and WILL be lost on the next restart or ' +
        'redeploy. Attach a Persistent Disk (e.g. mounted at /var/data) and set ' +
        `UPLOADS_DIR to a path inside it (e.g. /var/data/uploads). Current directory: ${dir}`
    );
  }

  // Confirm the directory can actually be created and written to. A read-only or
  // missing disk mount is a deploy-time error that should be obvious immediately,
  // not discovered when a content editor tries to save an image.
  try {
    fs.mkdirSync(dir, { recursive: true });
    fs.accessSync(dir, fs.constants.W_OK);
  } catch (err) {
    console.error(
      `[Uploads] FATAL: uploads directory is not writable: ${dir}`,
      (err as Error).message
    );
  }
}
