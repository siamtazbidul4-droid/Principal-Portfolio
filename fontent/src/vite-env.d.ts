/// <reference types="vite/client" />

// Typed declaration of the build-time environment variables the SPA consumes.
// Vite inlines `import.meta.env.VITE_*` values at build time, so these must be
// present in the build environment (e.g. a Render Static Site build) for the
// production bundle to point at the correct API origin.
interface ImportMetaEnv {
  readonly VITE_API_BASE_URL?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
