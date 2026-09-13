import mongoose, { Schema, Document } from 'mongoose';

export interface IService extends Document {
  title: string;
  shortDescription: string;
  detailedDescription: string;
  icon: string;
  features: string[];
  deliverables: string[];
  order: number;
  published: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const ServiceSchema: Schema = new Schema(
  {
    title: { type: String, required: true, trim: true },
    shortDescription: { type: String, required: true },
    detailedDescription: { type: String, required: true },
    icon: { type: String, default: 'Code' },
    features: [{ type: String }],
    deliverables: [{ type: String }],
    order: { type: Number, default: 0, index: true },
    published: { type: Boolean, default: true, index: true },
  },
  { timestamps: true }
);

export const ServiceModel = mongoose.models.Service || mongoose.model<IService>('Service', ServiceSchema);
