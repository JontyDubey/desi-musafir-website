import { getAdminIdToken } from '../lib/firebase';

export interface CloudinaryUploadResult {
  secureUrl: string;
  publicId: string;
  width: number;
  height: number;
  format: string;
}

export interface SignatureResponse {
  signature: string;
  timestamp: number;
  apiKey: string;
  cloudName: string;
  folder: string;
  error?: string;
}

/**
 * Requests signed upload parameters from the backend serverless function.
 * This guarantees CLOUDINARY_API_SECRET is NEVER exposed to the browser.
 */
export async function getCloudinaryUploadSignature(folder = 'desi-musafir/gallery'): Promise<SignatureResponse> {
  const token = await getAdminIdToken();

  if (!token) {
    throw new Error('You must be signed in as an administrator to upload images.');
  }

  const response = await fetch('/api/cloudinary/sign', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ folder }),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.error || data.details || 'Failed to obtain Cloudinary signature from server.');
  }

  return data;
}

/**
 * Uploads an image file directly to Cloudinary using signed parameters.
 */
export async function uploadImageToCloudinary(
  file: File,
  folder = 'desi-musafir/gallery',
  onProgress?: (percent: number) => void
): Promise<CloudinaryUploadResult> {
  // Validate file size (max 10MB on free plan)
  const MAX_SIZE_MB = 10;
  if (file.size > MAX_SIZE_MB * 1024 * 1024) {
    throw new Error(`Image size exceeds the ${MAX_SIZE_MB}MB limit for free tier.`);
  }

  // Validate mime type
  if (!file.type.startsWith('image/')) {
    throw new Error('Selected file is not an image.');
  }

  // 1. Get signed signature from server
  const signData = await getCloudinaryUploadSignature(folder);

  // 2. Prepare multipart upload to Cloudinary API
  const formData = new FormData();
  formData.append('file', file);
  formData.append('api_key', signData.apiKey);
  formData.append('timestamp', String(signData.timestamp));
  formData.append('signature', signData.signature);
  formData.append('folder', signData.folder);

  return new Promise((resolve, reject) => {
    const xhr = new XMLHttpRequest();
    xhr.open('POST', `https://api.cloudinary.com/v1_1/${signData.cloudName}/image/upload`);

    if (xhr.upload && onProgress) {
      xhr.upload.onprogress = (e) => {
        if (e.lengthComputable) {
          const percent = Math.round((e.loaded / e.total) * 100);
          onProgress(percent);
        }
      };
    }

    xhr.onload = () => {
      if (xhr.status >= 200 && xhr.status < 300) {
        try {
          const res = JSON.parse(xhr.responseText);
          resolve({
            secureUrl: res.secure_url,
            publicId: res.public_id,
            width: res.width,
            height: res.height,
            format: res.format,
          });
        } catch (err) {
          reject(new Error('Invalid response from Cloudinary API.'));
        }
      } else {
        try {
          const errRes = JSON.parse(xhr.responseText);
          reject(new Error(errRes.error?.message || 'Cloudinary upload failed.'));
        } catch {
          reject(new Error(`Cloudinary upload failed with HTTP status ${xhr.status}.`));
        }
      }
    };

    xhr.onerror = () => {
      reject(new Error('Network error during image upload to Cloudinary.'));
    };

    xhr.send(formData);
  });
}

/**
 * Requests backend deletion of a Cloudinary asset.
 */
export async function deleteImageFromCloudinary(publicId: string): Promise<void> {
  const token = await getAdminIdToken();
  if (!token) {
    throw new Error('Administrator authentication required to delete assets.');
  }

  const response = await fetch('/api/cloudinary/delete', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ publicId }),
  });

  if (!response.ok) {
    const data = await response.json().catch(() => ({}));
    throw new Error(data.error || 'Failed to delete asset from Cloudinary.');
  }
}
