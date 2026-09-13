import mongoose, { Schema, Document } from 'mongoose';

export interface IContact extends Document {
  name: string;
  email: string;
  company?: string;
  projectType: string;
  budgetRange?: string;
  message: string;
  status: 'unread' | 'read' | 'contacted' | 'archived';
  ip?: string;
  emailSent: boolean;
  emailError?: string;
  createdAt: Date;
  updatedAt: Date;
}

const ContactSchema: Schema = new Schema(
  {
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, lowercase: true, trim: true },
    company: { type: String, trim: true },
    projectType: {
      type: String,
      required: true,
      default: 'Web Application',
    },
    budgetRange: { type: String },
    message: { type: String, required: true },
    status: {
      type: String,
      enum: ['unread', 'read', 'contacted', 'archived'],
      default: 'unread',
      index: true,
    },
    ip: { type: String },
    emailSent: { type: Boolean, default: false },
    emailError: { type: String },
  },
  { timestamps: true }
);

ContactSchema.index({ createdAt: -1 });

export const ContactModel = mongoose.models.Contact || mongoose.model<IContact>('Contact', ContactSchema);
