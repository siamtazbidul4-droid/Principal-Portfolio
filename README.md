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
│   │   ├── services/              # StorageService (MongoDB + fallback), EmailService (HTTPS REST API)
│   │   └── validators/            # Request payload validation
│   └── uploads/                   # Local static uploads directory with public static serving
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
* Files are uploaded securely via `POST /api/upload` and served from `backend/uploads`.

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

The server binds to `0.0.0.0` and reads `process.env.PORT`, so it works on Render out of the box.

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
