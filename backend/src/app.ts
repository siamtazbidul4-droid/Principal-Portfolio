import express from 'express';
import cors from 'cors';
import authRoutes from './routes/auth.routes.js';
import projectRoutes from './routes/project.routes.js';
import contactRoutes from './routes/contact.routes.js';
import serviceRoutes from './routes/service.routes.js';
import testimonialRoutes from './routes/testimonial.routes.js';
import settingsRoutes from './routes/settings.routes.js';
import uploadRoutes from './routes/upload.routes.js';
import { errorHandler, notFoundHandler } from './middleware/error.middleware.js';
import { isMongoConnected } from './config/database.js';
import { getUploadsDir } from './config/uploads.js';
import { config } from './config/env.js';

// Origins are compared after trimming whitespace and stripping any trailing slash.
// A common production misconfiguration is `CORS_ORIGINS=https://app.example.com/`
// (trailing slash) or a value with a stray space, which would otherwise never match
// the browser's Origin header (`https://app.example.com`) and silently break CORS.
function normalizeOrigin(origin: string): string {
  return origin.trim().replace(/\/+$/, '').toLowerCase();
}

export function createExpressApp() {
  const app = express();

  // Behind a reverse proxy (Render, Vercel, nginx), trust the first proxy hop so
  // that req.ip / X-Forwarded-For are correct for rate limiting and audit logs.
  app.set('trust proxy', 1);

  // Pre-compute the normalized allow-list once so lookups are cheap and consistent.
  const allowedOrigins = new Set(config.corsOrigins.map(normalizeOrigin));

  // Surface the effective CORS policy on boot. Without this, a mismatched
  // CORS_ORIGINS value results in the browser-only error
  // "No 'Access-Control-Allow-Origin' header is present" with no server-side hint.
  if (config.isProduction) {
    console.log(
      `[CORS] Production allow-list (${allowedOrigins.size}): ${
        allowedOrigins.size > 0 ? Array.from(allowedOrigins).join(', ') : '<empty — cross-origin browser requests will be blocked>'
      }`
    );
  }

  // CORS policy.
  // - Development: reflect the request origin so the Vite dev server works from any port.
  // - Production: only allow explicitly whitelisted origins (CORS_ORIGINS). Same-origin
  //   requests (no Origin header, e.g. server-to-server or same-host) are always allowed.
  app.use(
    cors({
      origin(origin, callback) {
        if (!origin) {
          // Same-origin requests and non-browser clients send no Origin header.
          return callback(null, true);
        }
        if (!config.isProduction) {
          return callback(null, true);
        }
        if (allowedOrigins.has(normalizeOrigin(origin))) {
          return callback(null, true);
        }
        console.warn(`[CORS] Blocked disallowed origin: ${origin}`);
        return callback(null, false);
      },
      credentials: true,
    })
  );
  app.use(express.json({ limit: '12mb' }));
  app.use(express.urlencoded({ extended: true, limit: '12mb' }));

  // Static directory for the LOCAL uploads fallback (development, and serving any
  // pre-existing legacy `/uploads/...` records). Production uploads are stored on
  // Cloudinary and referenced by absolute HTTPS URLs, so no disk is required.
  const uploadsDir = getUploadsDir();
  app.use('/uploads', express.static(uploadsDir));

  // Custom minimal security headers
  app.use((req, res, next) => {
    res.setHeader('X-Content-Type-Options', 'nosniff');
    res.setHeader('X-Frame-Options', 'SAMEORIGIN');
    res.setHeader('X-XSS-Protection', '1; mode=block');
    next();
  });

  // Health and system status route
  app.get('/api/health', (req, res) => {
    res.status(200).json({
      status: 'healthy',
      service: 'Aurelius Luxury Portfolio API',
      timestamp: new Date().toISOString(),
      database: isMongoConnected() ? 'MongoDB Cluster (Connected)' : 'Local Persistent Storage Engine',
      environment: process.env.NODE_ENV || 'development',
    });
  });

  // REST API Endpoints
  app.use('/api/auth', authRoutes);
  app.use('/api/projects', projectRoutes);
  app.use('/api/contact', contactRoutes);
  app.use('/api/services', serviceRoutes);
  app.use('/api/testimonials', testimonialRoutes);
  app.use('/api/settings', settingsRoutes);
  app.use('/api/upload', uploadRoutes);

  // Unknown API routes -> JSON 404 (only reached if no route matched above).
  app.use('/api/*', notFoundHandler);

  app.use(errorHandler);

  return app;
}
