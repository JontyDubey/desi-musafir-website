import type { VercelRequest, VercelResponse } from '@vercel/node';
import { v2 as cloudinary } from 'cloudinary';
import { verifyAdminRequest } from '../_utils/auth';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  // Only POST allowed
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed. Use POST.' });
  }

  // 1. Verify Authentication & Admin Authorization
  const authHeader = req.headers.authorization;
  const authCheck = await verifyAdminRequest(authHeader);

  if (!authCheck.authenticated) {
    return res.status(401).json({ error: authCheck.error || 'Unauthorized' });
  }

  if (!authCheck.isAdmin) {
    return res.status(403).json({ error: authCheck.error || 'Forbidden: Administrator privileges required.' });
  }

  // 2. Validate Environment Secrets
  const cloudName = process.env.CLOUDINARY_CLOUD_NAME;
  const apiKey = process.env.CLOUDINARY_API_KEY;
  const apiSecret = process.env.CLOUDINARY_API_SECRET;

  if (!cloudName || !apiKey || !apiSecret) {
    return res.status(500).json({
      error: 'Cloudinary server configuration missing.',
      details: 'Please configure CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY, and CLOUDINARY_API_SECRET in your environment variables.',
    });
  }

  // 3. Configure Cloudinary
  cloudinary.config({
    cloud_name: cloudName,
    api_key: apiKey,
    api_secret: apiSecret,
    secure: true,
  });

  try {
    const { folder = 'desi-musafir', tags } = req.body || {};

    // Validate folder path to prevent arbitrary bucket pollution
    const allowedFolders = ['desi-musafir', 'desi-musafir/gallery', 'desi-musafir/articles', 'desi-musafir/destinations'];
    const targetFolder = allowedFolders.includes(folder) ? folder : 'desi-musafir';

    const timestamp = Math.round(new Date().getTime() / 1000);

    const paramsToSign: Record<string, any> = {
      folder: targetFolder,
      timestamp,
    };

    if (tags && typeof tags === 'string') {
      paramsToSign.tags = tags;
    }

    // Generate cryptographic signature on server
    const signature = cloudinary.utils.api_sign_request(paramsToSign, apiSecret);

    return res.status(200).json({
      signature,
      timestamp,
      apiKey,
      cloudName,
      folder: targetFolder,
    });
  } catch (error: any) {
    console.error('Error generating Cloudinary signature:', error);
    return res.status(500).json({
      error: 'Failed to generate upload signature',
      message: error.message,
    });
  }
}
