import type { VercelRequest, VercelResponse } from '@vercel/node';
import { v2 as cloudinary } from 'cloudinary';
import { verifyAdminRequest } from '../_utils/auth';

export default async function handler(req: VercelRequest, res: VercelResponse) {
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

  // 2. Validate Secrets
  const cloudName = process.env.CLOUDINARY_CLOUD_NAME;
  const apiKey = process.env.CLOUDINARY_API_KEY;
  const apiSecret = process.env.CLOUDINARY_API_SECRET;

  if (!cloudName || !apiKey || !apiSecret) {
    return res.status(500).json({
      error: 'Cloudinary server credentials missing in environment.',
    });
  }

  cloudinary.config({
    cloud_name: cloudName,
    api_key: apiKey,
    api_secret: apiSecret,
    secure: true,
  });

  const { publicId } = req.body || {};

  if (!publicId || typeof publicId !== 'string') {
    return res.status(400).json({ error: 'Missing required field: publicId' });
  }

  try {
    const result = await cloudinary.uploader.destroy(publicId);
    return res.status(200).json({
      status: 'success',
      result,
    });
  } catch (error: any) {
    console.error('Cloudinary deletion error:', error);
    return res.status(500).json({
      error: 'Failed to delete asset from Cloudinary',
      message: error.message,
    });
  }
}
