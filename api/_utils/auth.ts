import { getApps, initializeApp, cert, App } from 'firebase-admin/app';
import { getAuth } from 'firebase-admin/auth';
import { getFirestore } from 'firebase-admin/firestore';

// Initialize Firebase Admin if not already initialized
function getAdminApp(): App {
  const existingApps = getApps();
  if (existingApps.length > 0) {
    return existingApps[0];
  }

  const projectId = process.env.FIREBASE_PROJECT_ID || 'desi-musafir';

  // If service account is provided via env var
  if (process.env.FIREBASE_SERVICE_ACCOUNT_KEY) {
    try {
      const serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT_KEY);
      return initializeApp({
        credential: cert(serviceAccount),
        projectId,
      });
    } catch (e) {
      console.warn('Could not parse FIREBASE_SERVICE_ACCOUNT_KEY, using default admin init');
    }
  }

  return initializeApp({ projectId });
}

export interface AuthValidationResult {
  authenticated: boolean;
  isAdmin: boolean;
  uid?: string;
  email?: string;
  error?: string;
}

export async function verifyAdminRequest(authHeader: string | undefined): Promise<AuthValidationResult> {
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return {
      authenticated: false,
      isAdmin: false,
      error: 'Missing or malformed Authorization header. Expected Bearer token.',
    };
  }

  const idToken = authHeader.split('Bearer ')[1].trim();
  if (!idToken) {
    return {
      authenticated: false,
      isAdmin: false,
      error: 'Empty Bearer token provided.',
    };
  }

  try {
    const app = getAdminApp();
    const auth = getAuth(app);
    const decodedToken = await auth.verifyIdToken(idToken);

    const isEmailVerified = decodedToken.email_verified === true;
    if (!isEmailVerified) {
      return {
        authenticated: true,
        isAdmin: false,
        uid: decodedToken.uid,
        email: decodedToken.email,
        error: 'Forbidden: Email verification is required for administrator access.',
      };
    }

    const isBootstrapAdmin = decodedToken.email === 'dubeyjonty0@gmail.com';

    // Also check Firestore admins/{uid} document if not bootstrap admin
    let hasAdminDoc = false;
    if (!isBootstrapAdmin) {
      try {
        const firestore = getFirestore(app);
        const adminDoc = await firestore.collection('admins').doc(decodedToken.uid).get();
        hasAdminDoc = adminDoc.exists;
      } catch (err) {
        console.warn('Could not check admins collection:', err);
      }
    }

    if (!isBootstrapAdmin && !hasAdminDoc) {
      return {
        authenticated: true,
        isAdmin: false,
        uid: decodedToken.uid,
        email: decodedToken.email,
        error: 'Forbidden: Authenticated user is not an authorized administrator.',
      };
    }

    return {
      authenticated: true,
      isAdmin: true,
      uid: decodedToken.uid,
      email: decodedToken.email,
    };
  } catch (error: any) {
    console.error('Firebase token verification error:', error);
    return {
      authenticated: false,
      isAdmin: false,
      error: `Token verification failed: ${error.message || 'Invalid token'}`,
    };
  }
}
