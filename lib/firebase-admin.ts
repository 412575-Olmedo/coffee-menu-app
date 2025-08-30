// lib/firebase-admin.ts
import * as admin from 'firebase-admin';
import { getFirestore, Timestamp } from 'firebase-admin/firestore';
import { getStorage } from 'firebase-admin/storage';

// Configuración desde variables de entorno
const serviceAccount = process.env.FIREBASE_SERVICE_ACCOUNT_BASE64 ? 
  JSON.parse(Buffer.from(process.env.FIREBASE_SERVICE_ACCOUNT_BASE64, 'base64').toString('utf-8')) : 
  null;

if (!admin.apps.length && serviceAccount) {
  try {
    admin.initializeApp({
      credential: admin.credential.cert(serviceAccount),
      storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
    });
  } catch (error) {
    console.error('Firebase Admin initialization error:', error);
  }
} else if (!serviceAccount) {
  console.warn('Firebase Service Account no configurada. Solo funciones de cliente disponibles.');
}

const db = getFirestore();
const storage = getStorage();

export { db, storage, Timestamp };