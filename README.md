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
