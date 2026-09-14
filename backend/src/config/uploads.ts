import fs from 'fs';
import path from 'path';

/**
 * Absolute directory for the LOCAL uploads fallback.
 *
 * In production, uploaded images are stored on Cloudinary (see
 * `services/cloudinary.service.ts`) and the database holds a permanent HTTPS URL,
 * so this directory is not the durable store. It remains in use for two things:
 *   1. `npm run dev` without Cloudinary credentials configured.
 *   2. Serving any pre-existing legacy `/uploads/...` records if their files are
 *      still present.
 *
 * Defaults to `<repo-root>/backend/data/uploads`; can be overridden with the
 * `UPLOADS_DIR` environment variable.
 */
export function getUploadsDir(): string {
  const override = (process.env.UPLOADS_DIR || '').trim();
  if (override) return path.resolve(override);
  return path.join(process.cwd(), 'backend', 'data', 'uploads');
}

/**
 * The local uploads directory is a DEVELOPMENT fallback only. In production,
 * uploaded images are stored on Cloudinary and an absolute HTTPS URL is kept in
 * the database, so this directory is never the durable store on ephemeral hosts
 * such as Render (which also cannot mount a Persistent Disk on the Free plan).
 */
export function isUploadsEphemeral(): boolean {
  return !(process.env.UPLOADS_DIR || '').trim();
}

/**
 * Boot-time diagnostic for image storage configuration.
 *
 * Storage is durable when Cloudinary is configured (the production path) or when
 * a local run is intentionally using the filesystem in development. The single
 * condition worth shouting about is a PRODUCTION boot where Cloudinary is absent:
 * uploads would then land on the ephemeral container filesystem and vanish on the
 * next restart/redeploy. `config/env.ts` already treats missing Cloudinary
 * credentials in production as a fatal misconfiguration, so this is a complementary
 * clarity log (and confirms the local fallback directory is writable).
 */
export function warnIfUploadsAreEphemeral(): void {
  const dir = getUploadsDir();
  const cloudinaryConfigured = Boolean(
    process.env.CLOUDINARY_CLOUD_NAME &&
      process.env.CLOUDINARY_API_KEY &&
      process.env.CLOUDINARY_API_SECRET
  );

  if (process.env.NODE_ENV === 'production' && !cloudinaryConfigured) {
    console.warn(
      '[Uploads] WARNING: Cloudinary is not configured in production — uploaded images would be ' +
        'written to the ephemeral container filesystem and lost on the next restart/redeploy. ' +
        'Set CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY and CLOUDINARY_API_SECRET. ' +
        `Local fallback directory: ${dir}`
    );
  }

  // Confirm the local fallback directory can be created and written to. In
  // production Cloudinary is used, but a writable local dir keeps development and
  // any legacy `/uploads/...` records servable rather than failing silently.
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
