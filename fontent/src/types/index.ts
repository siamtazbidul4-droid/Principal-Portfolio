export interface IEngineeringChallenge {
  title: string;
  solution: string;
}

export interface IProjectArchitecture {
  client: string;
  api: string;
  serviceLayer: string;
  database: string;
  diagramSummary: string;
}

export interface IProject {
  _id?: string;
  id?: string;
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
  architecture: IProjectArchitecture;
  keyFeatures: string[];
  engineeringChallenges: IEngineeringChallenge[];
  results: string[];
  liveUrl?: string;
  githubUrl?: string;
  published: boolean;
  featured: boolean;
  order: number;
  createdAt?: string;
  updatedAt?: string;
}

export interface IService {
  _id?: string;
  id?: string;
  title: string;
  shortDescription: string;
  detailedDescription: string;
  icon: string;
  features: string[];
  deliverables: string[];
  order: number;
  published: boolean;
}

export interface ITestimonial {
  _id?: string;
  id?: string;
  name: string;
  role: string;
  company: string;
  quote: string;
  avatarUrl?: string;
  projectSlug?: string;
  order: number;
  published: boolean;
  isPlaceholder?: boolean;
}

export interface ISiteSettings {
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
}

export interface IContactInquiry {
  _id?: string;
  id?: string;
  name: string;
  email: string;
  company?: string;
  projectType: string;
  budgetRange?: string;
  message: string;
  status: 'unread' | 'read' | 'contacted' | 'archived';
  ip?: string;
  emailSent?: boolean;
  createdAt: string;
}

export interface IAdminUser {
  id: string;
  email: string;
  name: string;
  role: string;
  lastLogin?: string;
}

export interface ApiResponse<T = any> {
  success: boolean;
  message?: string;
  data?: T;
  errors?: Array<{ field: string; message: string }>;
}
