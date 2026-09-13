import mongoose, { Schema, Document } from 'mongoose';

export interface ISiteSettings extends Document {
  name: string;
  professionalTitle: string;
  heroEyebrow: string;
  heroHeading: string;
  heroDescription: string;
  email: string;
  socialLinks: {
    github: string;
    linkedin: string;
    twitter?: string;
  };
  resumeUrl?: string;
  availabilityStatus: string;
  availabilityNote: string;
  footerText: string;
  seoTitle: string;
  seoDescription: string;
  updatedAt: Date;
}

const SiteSettingsSchema: Schema = new Schema(
  {
    name: { type: String, default: 'Tazbidul Siam' },
    professionalTitle: { type: String, default: 'Principal Full-Stack Software Engineer & Digital Product Builder' },
    heroEyebrow: { type: String, default: 'INDEPENDENT FULL-STACK SOFTWARE ENGINEER' },
    heroHeading: { type: String, default: 'I BUILD DIGITAL PRODUCTS THAT FEEL AS GOOD AS THEY PERFORM.' },
    heroDescription: {
      type: String,
      default: 'I design and engineer high-performance web applications, SaaS platforms, and distributed digital products using modern full-stack technologies.',
    },
    email: { type: String, default: 'siamtazbidul4@gmail.com' },
    socialLinks: {
      github: { type: String, default: 'https://github.com' },
      linkedin: { type: String, default: 'https://linkedin.com' },
      twitter: { type: String, default: 'https://x.com' },
    },
    resumeUrl: { type: String, default: '#' },
    availabilityStatus: { type: String, default: 'Available for Q3 / Q4 2026' },
    availabilityNote: { type: String, default: 'Accepting select new product builds and architecture consulting contracts.' },
    footerText: { type: String, default: "LET'S BUILD SOMETHING WORTH REMEMBERING." },
    seoTitle: { type: String, default: 'Tazbidul Siam — Principal Full-Stack Engineer' },
    seoDescription: {
      type: String,
      default: 'Production-grade luxury digital product portfolio and software engineering consultancy.',
    },
  },
  { timestamps: true }
);

export const SiteSettingsModel = mongoose.models.SiteSettings || mongoose.model<ISiteSettings>('SiteSettings', SiteSettingsSchema);
