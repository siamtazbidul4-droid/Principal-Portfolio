import mongoose, { Schema, Document } from 'mongoose';

export interface ITestimonial extends Document {
  name: string;
  role: string;
  company: string;
  quote: string;
  avatarUrl?: string;
  projectSlug?: string;
  order: number;
  published: boolean;
  isPlaceholder: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const TestimonialSchema: Schema = new Schema(
  {
    name: { type: String, required: true, trim: true },
    role: { type: String, required: true, trim: true },
    company: { type: String, required: true, trim: true },
    quote: { type: String, required: true },
    avatarUrl: { type: String },
    projectSlug: { type: String },
    order: { type: Number, default: 0, index: true },
    published: { type: Boolean, default: true, index: true },
    isPlaceholder: { type: Boolean, default: false },
  },
  { timestamps: true }
);

export const TestimonialModel = mongoose.models.Testimonial || mongoose.model<ITestimonial>('Testimonial', TestimonialSchema);
