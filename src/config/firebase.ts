import * as admin from 'firebase-admin';
import dotenv from 'dotenv';

dotenv.config();

if (!admin.apps.length) {
  try {
    if (process.env.FIREBASE_SERVICE_ACCOUNT_JSON) {
      const serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT_JSON);
      admin.initializeApp({
        credential: admin.credential.cert(serviceAccount)
      });
    } else {
      // Fallback: try application default credentials or just initialize without explicit cert
      // Note: for Custom Claims, explicit credentials are required unless running on GCP with proper roles.
      admin.initializeApp();
      console.warn('⚠️ Firebase Admin initialized without explicit FIREBASE_SERVICE_ACCOUNT_JSON. Custom claims might fail locally.');
    }
    console.log('Firebase Admin SDK initialized successfully.');
  } catch (error) {
    console.error('Error initializing Firebase Admin SDK:', error);
  }
}

export const auth = admin.auth();
export default admin;
