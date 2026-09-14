# Aurelius Digital Product & Engineering Consultancy

Production-ready, full-stack digital product portfolio and consultancy management platform for **Tazbidul Siam — Principal Full-Stack Engineer**.

## Architecture & Directory Layout

The application architecture is strictly partitioned into two primary application directories at the root level:

```text
├── backend/
│   ├── src/
│   │   ├── app.ts                 # Express application bootstrapping & middleware
│   │   ├── config/                # Environment variables & runtime configurations
│   │   ├── controllers/           # API controllers (Projects, Services, Testimonials, Contacts, Upload, Auth)
│   │   ├── middleware/            # JWT authentication & rate limiting
│   │   ├── models/                # Mongoose schemas (Projects, Testimonials, Inquiries, Admin, Settings)
│   │   ├── routes/                # Express API routes
│   │   ├── services/              # StorageService (MongoDB + fallback), CloudinaryService, EmailService (HTTPS REST APIs)
│   │   └── validators/            # Request payload validation
│   └── data/uploads/              # Local development fallback only (production images live on Cloudinary)
├── fontent/
│   └── src/
│       ├── assets/                # Design assets and logos
│       ├── components/            # UI atoms, cards, modals, ImagePicker, DeleteConfirmModal
│       ├── context/               # AuthContext, ToastContext
│       ├── pages/                 # Home, Work, About, Services, Contact, ProjectDetails, AdminDashboard
│       ├── services/              # Client-side API gateways
│       ├── types/                 # Shared TypeScript interfaces & models
│       ├── App.tsx                # Client router & page hierarchy
│       ├── index.css              # Global styles & modern minimal scrollbar system
│       └── main.tsx               # React application entry point
├── package.json                   # Root package manifest
├── tsconfig.json                  # Root TypeScript configuration
├── vite.config.ts                 # Vite bundler configuration
├── server.ts                      # Full-stack dev & production Node.js server entry point
├── metadata.json                  # Application metadata & permissions
└── .env.example                   # Environment variable documentation
```

## Key Technical Systems

### 1. Dual Root Architecture
* **`backend/`**: Contains all server-side logic, controllers, models, services, authentication, and email delivery.
* **`fontent/`**: Contains the full React client application, Tailwind styling, views, and UI components.

### 2. Transactional Non-SMTP Email Delivery
* Form submissions are processed through an **HTTPS REST API** (Resend HTTP API) rather than SMTP.
* SMTP is strictly prohibited and not implemented.
* Safe fallback mode logs inquiries without failure when the API key is not yet configured.

### 3. Native File Explorer Image Picker
* Administrative views support direct image file selection via the native operating system file explorer (`Choose Image`).
* Supports PNG, JPEG/JPG, and WEBP formats with live preview, removal, and optional URL fallback.
* Files are uploaded via `POST /api/upload`, which stores them on **Cloudinary** and returns a permanent HTTPS URL (local filesystem fallback when Cloudinary is unconfigured).

### 4. Audited In-App Delete Workflow
* Destructive actions in the Admin panel utilize an in-app confirmation modal (`DeleteConfirmModal`).
* Confirmed deletions execute actual server-side queries on MongoDB and persistent storage, returning immediate UI updates.

### 5. Modern Minimal Scrollbar System
* Styled with unobtrusive subtle accents matching the dark luxury theme and light mode compatibility.
## Production Deployment (Render)

The repository is a **single-root project** (not an npm workspace): both the Express API and the React SPA are built from the root `package.json`. In production the Node server (`dist/server.cjs`) serves the built SPA from `dist/` **and** the `/api/*` routes, so it can be deployed as a single Render Web Service. A separate Static Site for the frontend is also supported (see below).

### Option A — Single Web Service (recommended, simplest)

| Setting | Value |
| --- | --- |
| Service type | Web Service |
| Root directory | *(repository root)* |
| Build command | `npm ci && npm run build` |
| Start command | `npm start` |
| Health check path | `/api/health` |
| Environment | Node 22 (see `.node-version` / `engines`) |
| `NODE_ENV` | `production` |
| `PORT` | *(injected by Render — do not hardcode)* |
| Plan | **Free** (no Persistent Disk, no paid upgrade) |
| `CLOUDINARY_CLOUD_NAME` | *(backend env — required)* |
| `CLOUDINARY_API_KEY` | *(backend env — required)* |
| `CLOUDINARY_API_SECRET` | *(backend env — required, never exposed to the frontend)* |

The server binds to `0.0.0.0` and reads `process.env.PORT`, so it works on Render out of the box.

#### Persistent uploads via Cloudinary (Render Free plan compatible)

Uploaded images are stored on **Cloudinary**, and the database keeps the permanent
absolute HTTPS URL that Cloudinary returns. This is deliberate: Render's container
filesystem is **ephemeral** (and Persistent Disks are not available on the Free
plan), so the previous "write to disk + Persistent Disk" approach could not work on
a free instance — images displayed immediately after upload and then broke after a
refresh/redeploy because the DB still held the `/uploads/...` path while the file was
gone.

Flow: Admin Panel → `POST /api/upload` → Cloudinary (signed server-side) → permanent
`https://res.cloudinary.com/...` URL → MongoDB → rendered by the public site.

| Setting | Value |
| --- | --- |
| Cloudinary env vars | `CLOUDINARY_CLOUD_NAME`, `CLOUDINARY_API_KEY`, `CLOUDINARY_API_SECRET` |
| Optional | `CLOUDINARY_FOLDER` (default `principal-portfolio`) |
| Render Persistent Disk | **not used** |

In production the server **fails fast at boot** if the Cloudinary credentials are
missing (the local filesystem is not durable on Render). In local development,
where the credentials are unset, uploads transparently fall back to the local
filesystem and are served from `/uploads`. The Cloudinary API secret is used only
to sign requests on the server and is never sent to the browser. `render.yaml`
declares the service and env vars (no disk).

### Option B — Split: Static Site (frontend) + Web Service (backend)

The frontend is a pure SPA served separately from the API. Because Vite inlines `import.meta.env.VITE_*` values **at build time**, the API origin must be set in the **Static Site build environment**, then the site redeployed.

| Setting | Value |
| --- | --- |
| Service type | Static Site |
| Root directory | *(repository root)* |
| Build command | `npm ci && npm run build` |
| Publish directory | `dist` |
| Env var (build-time) | `VITE_API_BASE_URL=https://principal-portfolio-backend.onrender.com/api` |

Backend Web Service:

| Setting | Value |
| --- | --- |
| Service type | Web Service |
| Root directory | *(repository root)* |
| Build command | `npm ci && npm run build` |
| Start command | `npm start` |
| Env var | `CORS_ORIGINS=https://principal-portfolio-forntend.onrender.com` |

> **CORS note:** `CORS_ORIGINS` must list the exact origin the browser sends (`scheme://host`, no trailing slash, no path). If it is empty or mismatched, cross-origin requests fail with `No 'Access-Control-Allow-Origin' header is present`. The origin list is logged once at boot as `[CORS] Production allow-list (...)`, and origins are normalized (whitespace and trailing slashes are ignored) before comparison.
