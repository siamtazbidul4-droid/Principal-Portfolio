import { z } from 'zod';

export const contactFormSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters').max(100, 'Name is too long').trim(),
  email: z.string().email('Please enter a valid email address').toLowerCase().trim(),
  company: z.string().max(100, 'Company name is too long').optional().or(z.literal('')),
  projectType: z.string().min(1, 'Project type required').max(100).default('Web Application'),
  budgetRange: z.string().max(100).optional().or(z.literal('')),
  message: z.string().min(10, 'Message must be at least 10 characters to provide project context').max(3000, 'Message is too long').trim(),
});

export const loginSchema = z.object({
  email: z.string().email('Valid email required').toLowerCase().trim(),
  password: z.string().min(6, 'Password must be at least 6 characters'),
});

export const projectSchema = z.object({
  title: z.string().min(2, 'Title required').trim(),
  slug: z.string().min(2, 'Slug required').regex(/^[a-z0-9-]+$/, 'Slug must only contain lowercase alphanumeric and dashes'),
  shortDescription: z.string().min(10, 'Short description required'),
  category: z.string().min(2, 'Category required'),
  role: z.string().min(2, 'Role required'),
  year: z.string().default('2025'),
  status: z.string().default('Completed'),
  technologies: z.array(z.string()).default([]),
  heroImage: z.string().min(1, 'Hero image URL required'),
  gallery: z.array(z.string()).default([]),
  overview: z.string().min(20, 'Detailed overview required'),
  challenge: z.string().min(20, 'Challenge description required'),
  approach: z.string().min(20, 'Approach description required'),
  architecture: z.object({
    client: z.string().default('React SPA + TypeScript + Tailwind CSS'),
    api: z.string().default('Node.js + Express REST API'),
    serviceLayer: z.string().default('Service Layer + Validation'),
    database: z.string().default('MongoDB + Mongoose Schemas'),
    diagramSummary: z.string().default('Client -> API -> Service Layer -> MongoDB'),
  }).optional(),
  keyFeatures: z.array(z.string()).default([]),
  engineeringChallenges: z.array(
    z.object({
      title: z.string().min(2),
      solution: z.string().min(5),
    })
  ).default([]),
  results: z.array(z.string()).default([]),
  liveUrl: z.string().optional().or(z.literal('')),
  githubUrl: z.string().optional().or(z.literal('')),
  published: z.boolean().default(true),
  featured: z.boolean().default(false),
  order: z.number().default(0),
});

export const serviceSchema = z.object({
  title: z.string().min(2, 'Title required'),
  shortDescription: z.string().min(10, 'Short description required'),
  detailedDescription: z.string().min(20, 'Detailed description required'),
  icon: z.string().default('Code'),
  features: z.array(z.string()).default([]),
  deliverables: z.array(z.string()).default([]),
  order: z.number().default(0),
  published: z.boolean().default(true),
});

export const testimonialSchema = z.object({
  name: z.string().min(2, 'Name required'),
  role: z.string().min(2, 'Role required'),
  company: z.string().min(2, 'Company required'),
  quote: z.string().min(10, 'Quote required'),
  avatarUrl: z.string().optional().or(z.literal('')),
  projectSlug: z.string().optional().or(z.literal('')),
  order: z.number().default(0),
  published: z.boolean().default(true),
  isPlaceholder: z.boolean().default(false),
});

export const settingsSchema = z.object({
  name: z.string().min(2),
  professionalTitle: z.string().min(2),
  heroEyebrow: z.string().min(2),
  heroHeading: z.string().min(2),
  heroDescription: z.string().min(10),
  email: z.string().email(),
  socialLinks: z.object({
    github: z.string(),
    linkedin: z.string(),
    twitter: z.string().optional(),
  }),
  resumeUrl: z.string().optional(),
  availabilityStatus: z.string(),
  availabilityNote: z.string(),
  footerText: z.string(),
  seoTitle: z.string(),
  seoDescription: z.string(),
});
