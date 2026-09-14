import path from 'path';
import express from 'express';
import { createServer as createViteServer } from 'vite';
import { connectDatabase } from './backend/src/config/database.js';
import { StorageService } from './backend/src/services/storage.service.js';
import { createExpressApp } from './backend/src/app.js';
import { config } from './backend/src/config/env.js';
import { warnIfUploadsAreEphemeral } from './backend/src/config/uploads.js';

async function startServer() {
  const PORT = config.port;
  const HOST = process.env.HOST || '0.0.0.0';

  // Connect to MongoDB if configured, otherwise fallback to persistent storage
  await connectDatabase();
  await StorageService.initialize();

  // Surface an image-storage misconfiguration at boot rather than silently losing
  // uploaded images on the next restart (see config/uploads.ts).
  warnIfUploadsAreEphemeral();

  const app = createExpressApp();

  // Vite middleware for development vs static build serving for production
  if (!config.isProduction) {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    // SPA fallback: never swallow backend paths. Missing /api/* is already
    // handled above as JSON 404; missing /uploads/* must stay a real 404 so
    // broken images are visible instead of silently returning index.html (200).
    app.get('*', (req, res, next) => {
      if (req.path.startsWith('/api/') || req.path.startsWith('/uploads/')) {
        return next();
      }
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  const server = app.listen(PORT, HOST, () => {
    console.log(`[Aurelius Portfolio] Server running on http://${HOST}:${PORT}`);
  });

  // Graceful shutdown so container platforms (Render, Fly, Docker) can drain connections.
  const shutdown = (signal: string) => {
    console.log(`[Aurelius Portfolio] Received ${signal}. Shutting down gracefully...`);
    server.close(() => {
      console.log('[Aurelius Portfolio] HTTP server closed.');
      process.exit(0);
    });
    // Force-exit if connections do not drain in time.
    setTimeout(() => process.exit(1), 10_000).unref();
  };

  process.on('SIGTERM', () => shutdown('SIGTERM'));
  process.on('SIGINT', () => shutdown('SIGINT'));
}

startServer().catch((err) => {
  console.error('Failed to start server:', err);
  process.exit(1);
});
