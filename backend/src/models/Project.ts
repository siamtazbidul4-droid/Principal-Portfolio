import mongoose, { Schema, Document } from 'mongoose';

export interface IEngineeringChallenge {
  title: string;
  solution: string;
}

export interface IProject extends Document {
  title: string;
  slug: string;
  shortDescription: string;
  category: string;
  role: string;
  year: string;
  status: string;
  technologies: string[];
  heroImage: string;
  gallery: string[];
  overview: string;
  challenge: string;
  approach: string;
  architecture: {
    client: string;
    api: string;
    serviceLayer: string;
    database: string;
    diagramSummary: string;
  };
  keyFeatures: string[];
  engineeringChallenges: IEngineeringChallenge[];
  results: string[];
  liveUrl?: string;
  githubUrl?: string;
  published: boolean;
  featured: boolean;
  order: number;
  createdAt: Date;
  updatedAt: Date;
}

const ProjectSchema: Schema = new Schema(
  {
    title: { type: String, required: true, trim: true },
    slug: { type: String, required: true, unique: true, lowercase: true, trim: true, index: true },
    shortDescription: { type: String, required: true },
    category: { type: String, required: true },
    role: { type: String, required: true },
    year: { type: String, default: '2025' },
    status: { type: String, default: 'Completed' },
    technologies: [{ type: String }],
    heroImage: { type: String, required: true },
    gallery: [{ type: String }],
    overview: { type: String, required: true },
    challenge: { type: String, required: true },
    approach: { type: String, required: true },
    architecture: {
      client: { type: String, default: 'React SPA + TypeScript + Tailwind CSS' },
      api: { type: String, default: 'Node.js + Express RESTful Endpoints' },
      serviceLayer: { type: String, default: 'Domain Services + Zod Validators' },
      database: { type: String, default: 'MongoDB + Mongoose with Indexed Schemas' },
      diagramSummary: { type: String, default: 'Client -> React SPA -> Express API -> Service Layer -> MongoDB' },
    },
    keyFeatures: [{ type: String }],
    engineeringChallenges: [
      {
        title: { type: String, required: true },
        solution: { type: String, required: true },
      },
    ],
    results: [{ type: String }],
    liveUrl: { type: String },
    githubUrl: { type: String },
    published: { type: Boolean, default: true, index: true },
    featured: { type: Boolean, default: false, index: true },
    order: { type: Number, default: 0, index: true },
  },
  { timestamps: true }
);

ProjectSchema.index({ published: 1, order: 1 });

export const ProjectModel = mongoose.models.Project || mongoose.model<IProject>('Project', ProjectSchema);
