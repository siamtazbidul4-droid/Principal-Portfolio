import fs from 'fs';
import path from 'path';
import bcrypt from 'bcryptjs';
import mongoose from 'mongoose';
import { config } from '../config/env.js';
import { isMongoConnected } from '../config/database.js';
import { AdminModel } from '../models/Admin.js';
import { ProjectModel } from '../models/Project.js';
import { ContactModel } from '../models/Contact.js';
import { ServiceModel } from '../models/Service.js';
import { TestimonialModel } from '../models/Testimonial.js';
import { SiteSettingsModel } from '../models/SiteSettings.js';
import { seedProjects, seedServices, seedTestimonials, seedSiteSettings } from '../config/seedData.js';

const DATA_DIR = path.resolve(process.cwd(), 'backend', 'data');
const DATA_FILE = path.join(DATA_DIR, 'store.json');

/**
 * A document identifier is only safe to hand to Mongoose's findById / findByIdAndUpdate
 * helpers when it is a valid ObjectId. Passing an arbitrary string (e.g. a malformed
 * URL param) throws a CastError that would otherwise surface as an HTTP 500 instead of
 * a correct "not found" (404). Guarding here keeps malformed IDs a client-side concern.
 */
function isObjectId(id: unknown): boolean {
  return typeof id === 'string' && mongoose.isValidObjectId(id);
}

interface LocalStore {
  admins: any[];
  projects: any[];
  contacts: any[];
  services: any[];
  testimonials: any[];
  settings: any;
}

function loadLocalStore(): LocalStore {
  try {
    if (!fs.existsSync(DATA_DIR)) {
      fs.mkdirSync(DATA_DIR, { recursive: true });
    }
    if (fs.existsSync(DATA_FILE)) {
      const content = fs.readFileSync(DATA_FILE, 'utf-8');
      return JSON.parse(content);
    }
  } catch (err) {
    console.error('Error loading local store:', err);
  }
  return {
    admins: [],
    projects: [],
    contacts: [],
    services: [],
    testimonials: [],
    settings: null,
  };
}

function saveLocalStore(store: LocalStore): void {
  try {
    if (!fs.existsSync(DATA_DIR)) {
      fs.mkdirSync(DATA_DIR, { recursive: true });
    }
    fs.writeFileSync(DATA_FILE, JSON.stringify(store, null, 2), 'utf-8');
  } catch (err) {
    console.error('Error saving local store:', err);
  }
}

export class StorageService {
  private static store: LocalStore = loadLocalStore();

  public static async initialize(): Promise<void> {
    const defaultPasswordHash = await bcrypt.hash(config.adminInitialPassword, 10);
    const adminEmail = config.adminInitialEmail.toLowerCase();

    // MongoDB document payload: must NOT contain a string _id (Mongoose generates an ObjectId).
    const mongoAdmin = {
      email: adminEmail,
      passwordHash: defaultPasswordHash,
      name: 'Tazbidul Siam',
      role: 'superadmin',
    };

    // In-memory local store payload: string ids are fine here and are required by the fallback engine.
    const localAdmin = {
      _id: 'admin-default-1',
      id: 'admin-default-1',
      ...mongoAdmin,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    if (isMongoConnected()) {
      try {
        const existingAdmin = await (AdminModel as any).findOne({ email: mongoAdmin.email });
        if (!existingAdmin) {
          await (AdminModel as any).create(mongoAdmin);
          console.log('[Storage] Seeded default admin into MongoDB');
        } else if (config.adminSyncPassword) {
          // Explicit opt-in (ADMIN_SYNC_PASSWORD=true): reconcile the stored password
          // with the configured ADMIN_INITIAL_PASSWORD. Off by default so routine boot
          // cycles never silently overwrite a changed password.
          await (AdminModel as any).findOneAndUpdate(
            { email: mongoAdmin.email },
            { passwordHash: mongoAdmin.passwordHash }
          );
          console.log('[Storage] Admin password reconciled with ADMIN_INITIAL_PASSWORD (ADMIN_SYNC_PASSWORD=true)');
        }

        const projectCount = await (ProjectModel as any).countDocuments();
        if (projectCount === 0) {
          await (ProjectModel as any).insertMany(seedProjects);
          console.log('[Storage] Seeded projects into MongoDB');
        }

        const serviceCount = await (ServiceModel as any).countDocuments();
        if (serviceCount === 0) {
          await (ServiceModel as any).insertMany(seedServices);
          console.log('[Storage] Seeded services into MongoDB');
        }

        const testimonialCount = await (TestimonialModel as any).countDocuments();
        if (testimonialCount === 0) {
          await (TestimonialModel as any).insertMany(seedTestimonials);
          console.log('[Storage] Seeded testimonials into MongoDB');
        }

        const settingsDoc = await (SiteSettingsModel as any).findOne();
        if (!settingsDoc) {
          await (SiteSettingsModel as any).create(seedSiteSettings);
          console.log('[Storage] Seeded site settings into MongoDB');
        }
        return;
      } catch (err) {
        console.warn('[Storage] MongoDB seed sync skipped, fallback active', err);
      }
    }

    // Local Store initialization
    if (this.store.admins.length === 0) {
      this.store.admins.push(localAdmin);
    } else if (config.adminSyncPassword) {
      const existing = this.store.admins.find((a) => a.email.toLowerCase() === adminEmail);
      if (existing) {
        existing.passwordHash = defaultPasswordHash;
        existing.updatedAt = new Date().toISOString();
        console.log('[Storage] Admin password reconciled in local store (ADMIN_SYNC_PASSWORD=true)');
      }
    }
    if (this.store.projects.length === 0) {
      this.store.projects = seedProjects.map((p, index) => ({
        ...p,
        _id: `project-${index + 1}`,
        id: `project-${index + 1}`,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      }));
    }
    if (this.store.services.length === 0) {
      this.store.services = seedServices.map((s, index) => ({
        ...s,
        _id: `service-${index + 1}`,
        id: `service-${index + 1}`,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      }));
    }
    if (this.store.testimonials.length === 0) {
      this.store.testimonials = seedTestimonials.map((t, index) => ({
        ...t,
        _id: `testimonial-${index + 1}`,
        id: `testimonial-${index + 1}`,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      }));
    }
    if (!this.store.settings) {
      this.store.settings = {
        ...seedSiteSettings,
        _id: 'settings-default-1',
        id: 'settings-default-1',
        updatedAt: new Date().toISOString(),
      };
    }
    saveLocalStore(this.store);
    console.log('[Storage] Persistent storage initialized successfully.');
  }

  // --- Projects ---
  public static async getProjects(options: { publishedOnly?: boolean } = {}): Promise<any[]> {
    if (isMongoConnected()) {
      const query = options.publishedOnly ? { published: true } : {};
      return await (ProjectModel as any).find(query).sort({ order: 1, createdAt: -1 }).lean();
    }
    let list = this.store.projects;
    if (options.publishedOnly) {
      list = list.filter((p) => p.published);
    }
    return [...list].sort((a, b) => (a.order || 0) - (b.order || 0));
  }

  public static async getProjectBySlug(slug: string): Promise<any | null> {
    if (isMongoConnected()) {
      return await (ProjectModel as any).findOne({ slug }).lean();
    }
    return this.store.projects.find((p) => p.slug === slug) || null;
  }

  public static async getProjectById(id: string): Promise<any | null> {
    if (isMongoConnected()) {
      if (!isObjectId(id)) return null;
      return await (ProjectModel as any).findById(id).lean();
    }
    return this.store.projects.find((p) => p._id === id || p.id === id) || null;
  }

  public static async createProject(data: any): Promise<any> {
    if (isMongoConnected()) {
      const doc = await (ProjectModel as any).create(data);
      return doc.toObject ? doc.toObject() : doc;
    }
    const newProject = {
      ...data,
      _id: `project-${Date.now()}`,
      id: `project-${Date.now()}`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    this.store.projects.push(newProject);
    saveLocalStore(this.store);
    return newProject;
  }

  public static async updateProject(id: string, data: any): Promise<any | null> {
    if (isMongoConnected()) {
      if (!isObjectId(id)) return null;
      return await (ProjectModel as any).findByIdAndUpdate(id, data, { returnDocument: 'after' }).lean();
    }
    const index = this.store.projects.findIndex((p) => p._id === id || p.id === id);
    if (index === -1) return null;
    this.store.projects[index] = {
      ...this.store.projects[index],
      ...data,
      updatedAt: new Date().toISOString(),
    };
    saveLocalStore(this.store);
    return this.store.projects[index];
  }

  public static async deleteProject(id: string): Promise<boolean> {
    if (isMongoConnected()) {
      if (!isObjectId(id)) return false;
      const res = await (ProjectModel as any).findByIdAndDelete(id);
      return !!res;
    }
    const initialLength = this.store.projects.length;
    this.store.projects = this.store.projects.filter((p) => p._id !== id && p.id !== id);
    saveLocalStore(this.store);
    return this.store.projects.length < initialLength;
  }

  // --- Contacts ---
  public static async getContacts(): Promise<any[]> {
    if (isMongoConnected()) {
      return await (ContactModel as any).find().sort({ createdAt: -1 }).lean();
    }
    return [...this.store.contacts].sort(
      (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );
  }

  public static async getContactById(id: string): Promise<any | null> {
    if (isMongoConnected()) {
      if (!isObjectId(id)) return null;
      return await (ContactModel as any).findById(id).lean();
    }
    return this.store.contacts.find((c) => c._id === id || c.id === id) || null;
  }

  public static async createContact(data: any): Promise<any> {
    if (isMongoConnected()) {
      const doc = await (ContactModel as any).create(data);
      return doc.toObject ? doc.toObject() : doc;
    }
    const newContact = {
      ...data,
      _id: `contact-${Date.now()}`,
      id: `contact-${Date.now()}`,
      status: 'unread',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    this.store.contacts.unshift(newContact);
    saveLocalStore(this.store);
    return newContact;
  }

  public static async updateContactStatus(id: string, status: string): Promise<any | null> {
    if (isMongoConnected()) {
      if (!isObjectId(id)) return null;
      return await (ContactModel as any).findByIdAndUpdate(id, { status }, { returnDocument: 'after' }).lean();
    }
    const contact = this.store.contacts.find((c) => c._id === id || c.id === id);
    if (!contact) return null;
    contact.status = status;
    contact.updatedAt = new Date().toISOString();
    saveLocalStore(this.store);
    return contact;
  }

  public static async updateContactEmailResult(id: string, emailSent: boolean, emailError?: string): Promise<any | null> {
    if (isMongoConnected()) {
      if (!isObjectId(id)) return null;
      return await (ContactModel as any).findByIdAndUpdate(
        id,
        { emailSent, ...(emailError ? { emailError } : {}) },
        { returnDocument: 'after' }
      ).lean();
    }
    const contact = this.store.contacts.find((c) => c._id === id || c.id === id);
    if (!contact) return null;
    contact.emailSent = emailSent;
    if (emailError) contact.emailError = emailError;
    contact.updatedAt = new Date().toISOString();
    saveLocalStore(this.store);
    return contact;
  }

  public static async deleteContact(id: string): Promise<boolean> {
    if (isMongoConnected()) {
      if (!isObjectId(id)) return false;
      const res = await (ContactModel as any).findByIdAndDelete(id);
      return !!res;
    }
    const len = this.store.contacts.length;
    this.store.contacts = this.store.contacts.filter((c) => c._id !== id && c.id !== id);
    saveLocalStore(this.store);
    return this.store.contacts.length < len;
  }

  // --- Services ---
  public static async getServices(options: { publishedOnly?: boolean } = {}): Promise<any[]> {
    if (isMongoConnected()) {
      const query = options.publishedOnly ? { published: true } : {};
      return await (ServiceModel as any).find(query).sort({ order: 1 }).lean();
    }
    let list = this.store.services;
    if (options.publishedOnly) list = list.filter((s) => s.published);
    return [...list].sort((a, b) => (a.order || 0) - (b.order || 0));
  }

  public static async createService(data: any): Promise<any> {
    if (isMongoConnected()) {
      const doc = await (ServiceModel as any).create(data);
      return doc.toObject ? doc.toObject() : doc;
    }
    const newService = {
      ...data,
      _id: `service-${Date.now()}`,
      id: `service-${Date.now()}`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    this.store.services.push(newService);
    saveLocalStore(this.store);
    return newService;
  }

  public static async updateService(id: string, data: any): Promise<any | null> {
    if (isMongoConnected()) {
      if (!isObjectId(id)) return null;
      return await (ServiceModel as any).findByIdAndUpdate(id, data, { returnDocument: 'after' }).lean();
    }
    const index = this.store.services.findIndex((s) => s._id === id || s.id === id);
    if (index === -1) return null;
    this.store.services[index] = { ...this.store.services[index], ...data, updatedAt: new Date().toISOString() };
    saveLocalStore(this.store);
    return this.store.services[index];
  }

  public static async deleteService(id: string): Promise<boolean> {
    if (isMongoConnected()) {
      if (!isObjectId(id)) return false;
      const res = await (ServiceModel as any).findByIdAndDelete(id);
      return !!res;
    }
    const len = this.store.services.length;
    this.store.services = this.store.services.filter((s) => s._id !== id && s.id !== id);
    saveLocalStore(this.store);
    return this.store.services.length < len;
  }

  // --- Testimonials ---
  public static async getTestimonials(options: { publishedOnly?: boolean } = {}): Promise<any[]> {
    if (isMongoConnected()) {
      const query = options.publishedOnly ? { published: true } : {};
      return await (TestimonialModel as any).find(query).sort({ order: 1 }).lean();
    }
    let list = this.store.testimonials;
    if (options.publishedOnly) list = list.filter((t) => t.published);
    return [...list].sort((a, b) => (a.order || 0) - (b.order || 0));
  }

  public static async createTestimonial(data: any): Promise<any> {
    if (isMongoConnected()) {
      const doc = await (TestimonialModel as any).create(data);
      return doc.toObject ? doc.toObject() : doc;
    }
    const newTestimonial = {
      ...data,
      _id: `testimonial-${Date.now()}`,
      id: `testimonial-${Date.now()}`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    this.store.testimonials.push(newTestimonial);
    saveLocalStore(this.store);
    return newTestimonial;
  }

  public static async updateTestimonial(id: string, data: any): Promise<any | null> {
    if (isMongoConnected()) {
      if (!isObjectId(id)) return null;
      return await (TestimonialModel as any).findByIdAndUpdate(id, data, { returnDocument: 'after' }).lean();
    }
    const idx = this.store.testimonials.findIndex((t) => t._id === id || t.id === id);
    if (idx === -1) return null;
    this.store.testimonials[idx] = { ...this.store.testimonials[idx], ...data, updatedAt: new Date().toISOString() };
    saveLocalStore(this.store);
    return this.store.testimonials[idx];
  }

  public static async deleteTestimonial(id: string): Promise<boolean> {
    if (isMongoConnected()) {
      if (!isObjectId(id)) return false;
      const res = await (TestimonialModel as any).findByIdAndDelete(id);
      return !!res;
    }
    const len = this.store.testimonials.length;
    this.store.testimonials = this.store.testimonials.filter((t) => t._id !== id && t.id !== id);
    saveLocalStore(this.store);
    return this.store.testimonials.length < len;
  }

  // --- Settings ---
  public static async getSettings(): Promise<any> {
    if (isMongoConnected()) {
      const doc = await (SiteSettingsModel as any).findOne().lean();
      if (doc) return doc;
    }
    return this.store.settings || seedSiteSettings;
  }

  public static async updateSettings(data: any): Promise<any> {
    if (isMongoConnected()) {
      return await (SiteSettingsModel as any).findOneAndUpdate({}, data, { returnDocument: 'after', upsert: true }).lean();
    }
    this.store.settings = { ...this.store.settings, ...data, updatedAt: new Date().toISOString() };
    saveLocalStore(this.store);
    return this.store.settings;
  }

  // --- Auth & Admin ---
  public static async getAdminByEmail(email: string): Promise<any | null> {
    const cleanEmail = email.toLowerCase().trim();
    if (isMongoConnected()) {
      return await (AdminModel as any).findOne({ email: cleanEmail }).lean();
    }
    return this.store.admins.find((a) => a.email.toLowerCase() === cleanEmail) || null;
  }

  public static async updateAdminLastLogin(identifier: unknown): Promise<void> {
    // `identifier` may be a Mongoose ObjectId instance or a plain string, so coerce defensively.
    const rawIdentifier = identifier == null ? '' : String(identifier);
    const cleanIdentifier = rawIdentifier.trim();

    if (isMongoConnected()) {
      // Prefer a valid ObjectId lookup; fall back to email lookup when the identifier
      // is not a real ObjectId (e.g. any legacy string id) to avoid CastErrors.
      if (cleanIdentifier && mongoose.isValidObjectId(cleanIdentifier)) {
        await (AdminModel as any).findByIdAndUpdate(cleanIdentifier, { lastLogin: new Date() });
      } else if (cleanIdentifier.includes('@')) {
        await (AdminModel as any).findOneAndUpdate(
          { email: cleanIdentifier.toLowerCase() },
          { lastLogin: new Date() }
        );
      }
      return;
    }
    const admin = this.store.admins.find(
      (a) => a._id === cleanIdentifier || a.id === cleanIdentifier
    );
    if (admin) {
      admin.lastLogin = new Date().toISOString();
      saveLocalStore(this.store);
    }
  }
}
