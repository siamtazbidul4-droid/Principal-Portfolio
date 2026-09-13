import { request } from './api';

export interface UploadResponse {
  success: boolean;
  message?: string;
  data?: {
    url: string;
    filename: string;
    size: number;
  };
}

export class UploadService {
  /**
   * Upload an image file from the native file picker to the backend storage.
   */
  public static async uploadImage(file: File): Promise<{ success: boolean; url?: string; message?: string }> {
    // Basic client-side validation
    const allowedTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/gif', 'image/svg+xml'];
    if (!allowedTypes.includes(file.type)) {
      return {
        success: false,
        message: 'Invalid file format. Please choose a JPEG, PNG, WEBP, GIF, or SVG image.',
      };
    }

    if (file.size > 10 * 1024 * 1024) {
      return {
        success: false,
        message: 'File size exceeds 10MB limit. Please choose a smaller image.',
      };
    }

    return new Promise((resolve) => {
      const reader = new FileReader();
      reader.onload = async () => {
        try {
          const dataUrl = reader.result as string;
          const res = await request<{ url: string; filename: string; size: number }>('/upload', {
            method: 'POST',
            body: JSON.stringify({
              filename: file.name,
              dataUrl,
            }),
          });

          if (res.success && res.data?.url) {
            resolve({ success: true, url: res.data.url });
          } else {
            resolve({
              success: false,
              message: res.message || 'Failed to upload image.',
            });
          }
        } catch (error) {
          resolve({
            success: false,
            message: (error as Error).message || 'Network error while uploading image.',
          });
        }
      };

      reader.onerror = () => {
        resolve({ success: false, message: 'Failed to read local file.' });
      };

      reader.readAsDataURL(file);
    });
  }
}
