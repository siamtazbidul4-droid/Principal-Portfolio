import crypto from 'crypto';
import { config } from '../config/env.js';

export interface CloudinaryUploadResult {
  success: boolean;
  url?: string;
  publicId?: string;
  error?: string;
  /**
   * 'live'    — uploaded to Cloudinary and a permanent HTTPS URL is available.
   * 'skipped' — Cloudinary is not configured (e.g. local development); the caller
   *             should fall back to the local filesystem path.
   */
  mode: 'live' | 'skipped';
}

/**
 * Cloudinary-backed persistent image storage.
 *
 * Why this exists: Render's container filesystem is ephemeral on the Free plan
 * (and Persistent Disks are not available there at all), so any file written to
 * disk is lost on the next restart/redeploy. Storing uploads on Cloudinary and
 * persisting the returned absolute HTTPS URL in MongoDB makes images durable with
 * no disk, no paid plan, and no manual file management.
 *
 * This deliberately uses the Cloudinary **HTTPS upload API via fetch** (signed
 * with the account API secret) instead of the Cloudinary SDK — matching the
 * project's existing convention of talking to providers over their REST API (see
 * `email.service.ts`, which uses the Resend HTTPS API rather than SMTP). No extra
 * dependency is introduced.
 *
 * The API secret is read from backend environment configuration and is only ever
 * used to compute a request signature on the server. It is never returned to or
 * referenced by the frontend.
 */
export class CloudinaryService {
  /** Whether Cloudinary is fully configured for this runtime. */
  public static isConfigured(): boolean {
    return config.cloudinary.isConfigured;
  }

  /**
   * Compute the Cloudinary request signature.
   * Algorithm (per Cloudinary docs): sort the signed parameters alphabetically,
   * join askey=value` pairs with `&`, append the API secret, SHA-1 hash it.
   */
  private static sign(params: Record<string, string>): string {
    const toSign = Object.keys(params)
      .filter((key) => params[key] !== undefined && params[key] !== null && params[key] !== '')
      .sort()
      .map((key) => `${key}=${params[key]}`)
      .join('&');
    return crypto
      .createHash('sha1')
      .update(toSign + config.cloudinary.apiSecret)
      .digest('hex');
  }

  /**
   * Upload a base64 image payload to Cloudinary and return its permanent URL.
   *
   * Returns `mode: 'skipped'` when Cloudinary is not configured so the caller can
   * transparently fall back to local-disk storage during development.
   */
  public static async uploadImage(
    dataUrl: string,
    options: { filename?: string } = {}
  ): Promise<CloudinaryUploadResult> {
    if (!this.isConfigured()) {
      return { success: false, mode: 'skipped' };
    }

    const { cloudName, apiKey, folder } = config.cloudinary;
    const timestamp = Math.floor(Date.now() / 1000);

    // Parameters that participate in the signature must match exactly between the
    // signed string and the multipart body.
    const signedParams: Record<string, string> = {
      folder,
      timestamp: String(timestamp),
    };
    const signature = this.sign(signedParams);

    try {
      const form = new FormData();
      form.append('file', dataUrl);
      form.append('api_key', apiKey);
      form.append('timestamp', String(timestamp));
      form.append('folder', folder);
      form.append('signature', signature);
      if (options.filename) {
        // Preserve a human-readable hint without controlling the public_id format.
        form.append('context', `filename=${options.filename.replace(/[^a-zA-Z0-9._-]/g, '_').slice(0, 64)}`);
      }

      const response = await fetch(
        `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`,
        { method: 'POST', body: form }
      );

      if (!response.ok) {
        const errBody = await response.text();
        let providerError = `Cloudinary responded with HTTP ${response.status}`;
        try {
          const parsed = JSON.parse(errBody);
          if (parsed.error?.message) providerError = `${parsed.error.message} (HTTP ${response.status})`;
        } catch {
          if (errBody) providerError = `${errBody} (HTTP ${response.status})`;
        }
        console.error('[CloudinaryService] Upload failed:', providerError);
        return { success: false, error: providerError, mode: 'live' };
      }

      const data = (await response.json()) as {
        secure_url?: string;
        url?: string;
        public_id?: string;
      };
      const url = data.secure_url || data.url;
      if (!url) {
        return { success: false, error: 'Cloudinary returned no image URL.', mode: 'live' };
      }

      console.log(`[CloudinaryService] Image uploaded to Cloudinary: ${data.public_id}`);
      return { success: true, url, publicId: data.public_id, mode: 'live' };
    } catch (error) {
      console.error('[CloudinaryService] Network error during upload:', error);
      return {
        success: false,
        error: (error as Error).message || 'Network failure communicating with Cloudinary.',
        mode: 'live',
      };
    }
  }
}
