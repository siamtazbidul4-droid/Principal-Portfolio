import dotenv from 'dotenv';

// Load environment variables from the real .env file only.
// NOTE: We deliberately do NOT fall back to `.env.example` — that is a committed
// template intended for documentation, never a secret source.
dotenv.config();

const nodeEnv = process.env.NODE_ENV || 'development';
const isProduction = nodeEnv === 'production';

/**
 * Collect configuration errors so that aconfigured production deployment fails
 * loudly at boot instead of silently degrading (e.g. an ephemeral local store).
 */
const configErrors: string[] = [];

// The insecure development fallback that must never survive into production.
const DEFAULT_ADMIN_PASSWORD = 'AdminPass123!';
const DEFAULT_JWT_SECRET = 'dev_only_insecure_jwt_secret_change_me';

if (isProduction) {
  if (!process.env.JWT_SECRET) {
    configErrors.push('JWT_SECRET must be set in production.');
  } else if (process.env.JWT_SECRET === DEFAULT_JWT_SECRET) {
    configErrors.push('JWT_SECRET must not be the development fallback value in production.');
  }
  if (!process.env.MONGODB_URI) {
    configErrors.push(
      'MONGODB_URI must be set in production (the local JSON store is not durable on ephemeral hosts such as Render/Vercel).'
    );
  }
  // Refuse to seed a predictable administrator password in production.
  // (Seeding only runs when no admin exists, but a fresh deploy would otherwise ship with this default.)
  if (!process.env.ADMIN_INITIAL_PASSWORD || process.env.ADMIN_INITIAL_PASSWORD === DEFAULT_ADMIN_PASSWORD) {
    configErrors.push(
      `ADMIN_INITIAL_PASSWORD must be set to a strong, unique value in production (the shared default "${DEFAULT_ADMIN_PASSWORD}" is not permitted).`
    );
  }
  if (!process.env.CORS_ORIGINS) {
    console.warn(
      '[Config] CORS_ORIGINS is not set — only same-origin browser requests will be accepted. Set it to your public URL(s) if the SPA is served from a different origin.'
    );
  }
  // Cloudinary is the persistent image store in production. Without it, uploaded
  // images would be written to the ephemeral container filesystem and lost on the
  // next restart/redeploy. Enforced here for the same reason as MONGODB_URI:
  // durable external storage is mandatory on ephemeral hosts such as Render.
  const hasCloudinary = Boolean(
    process.env.CLOUDINARY_CLOUD_NAME &&
      process.env.CLOUDINARY_API_KEY &&
      process.env.CLOUDINARY_API_SECRET
  );
  const hasPartialCloudinary =
    !hasCloudinary &&
    Boolean(
      process.env.CLOUDINARY_CLOUD_NAME ||
        process.env.CLOUDINARY_API_KEY ||
        process.env.CLOUDINARY_API_SECRET
    );
  if (hasPartialCloudinary) {
    configErrors.push(
      'Cloudinary is partially configured: set ALL of CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY and CLOUDINARY_API_SECRET (or none).'
    );
  } else if (!hasCloudinary) {
    configErrors.push(
      'Cloudinary credentials must be set in production (CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY, CLOUDINARY_API_SECRET). Uploaded images are stored on Cloudinary so they survive redeploys/restarts; the local filesystem is ephemeral on Render.'
    );
  }
}

if (configErrors.length > 0) {
  console.error('[Config] Fatal configuration error(s):');
  for (const err of configErrors) {
    console.error(`  - ${err}`);
  }
  // Fail fast: a broken production deployment should not pretend to be healthy.
  process.exit(1);
}

if (!isProduction && !process.env.JWT_SECRET) {
  console.warn(
    '[Config] JWT_SECRET is not set — using an insecure development-only fallback. Never deploy without setting it.'
  );
}
if (!isProduction && (!process.env.ADMIN_INITIAL_PASSWORD || process.env.ADMIN_INITIAL_PASSWORD === DEFAULT_ADMIN_PASSWORD)) {
  console.warn(
    '[Config] ADMIN_INITIAL_PASSWORD is not set — the development default will be used for the seeded admin. Set a strong value before deploying.'
  );
}

export const config = {
  nodeEnv,
  isProduction,
  port: parseInt(process.env.PORT || '3000', 10),
  mongodbUri: process.env.MONGODB_URI || '',
  jwtSecret: process.env.JWT_SECRET || DEFAULT_JWT_SECRET,
  emailProviderApiKey: process.env.EMAIL_PROVIDER_API_KEY || '',
  contactReceiverEmail: process.env.CONTACT_RECEIVER_EMAIL || 'siamtazbidul4@gmail.com',
  emailFrom: process.env.EMAIL_FROM || 'onboarding@resend.dev',
  adminInitialEmail: process.env.ADMIN_INITIAL_EMAIL || 'admin@portfolio.luxury',
  adminInitialPassword: process.env.ADMIN_INITIAL_PASSWORD || DEFAULT_ADMIN_PASSWORD,
  // Opt-in: when true, the seeded admin's password is reconciled with
  // ADMIN_INITIAL_PASSWORD on every boot. Intended for deliberate password resets.
  adminSyncPassword: process.env.ADMIN_SYNC_PASSWORD === 'true',
  // Comma-separated list of allowed browser origins for CORS in production.
  corsOrigins: (process.env.CORS_ORIGINS || '')
    .split(',')
    .map((origin) => origin.trim())
    .filter(Boolean),
  // Persistent image storage (Cloudinary). When all three are present, uploaded
  // images are streamed to Cloudinary and an absolute HTTPS URL is stored in the
  // database. When absent (local development), uploads fall back to the local
  // filesystem via the legacy `/uploads` path so `npm run dev` still works.
  cloudinary: {
    cloudName: process.env.CLOUDINARY_CLOUD_NAME || '',
    apiKey: process.env.CLOUDINARY_API_KEY || '',
    apiSecret: process.env.CLOUDINARY_API_SECRET || '',
    folder: process.env.CLOUDINARY_FOLDER || 'principal-portfolio',
    // Whether uploads should be routed to Cloudinary instead of local disk.
    isConfigured: Boolean(
      process.env.CLOUDINARY_CLOUD_NAME &&
        process.env.CLOUDINARY_API_KEY &&
        process.env.CLOUDINARY_API_SECRET
    ),
  },
};
