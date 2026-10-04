import { initializeApp, getApps, getApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import {
  initializeFirestore,
  getFirestore,
  doc,
  collection,
  onSnapshot,
  setDoc,
  deleteDoc,
  writeBatch,
  getDoc,
  getDocs,
} from 'firebase/firestore';
import { MenuItem, RestaurantConfig } from '../types/menu';
import firebaseConfig from '../../firebase-applet-config.json';

// Initialize Firebase
const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();

export const auth = getAuth(app);

// Use experimentalForceLongPolling to eliminate 10-second backend timeout warnings
// caused by reverse proxies buffering streaming WebChannels in cloud and mobile networks.
let firestoreInstance;
try {
  firestoreInstance = initializeFirestore(
    app,
    {
      experimentalForceLongPolling: true,
    },
    firebaseConfig.firestoreDatabaseId && firebaseConfig.firestoreDatabaseId !== '(default)'
      ? firebaseConfig.firestoreDatabaseId
      : undefined
  );
} catch {
  firestoreInstance =
    firebaseConfig.firestoreDatabaseId && firebaseConfig.firestoreDatabaseId !== '(default)'
      ? getFirestore(app, firebaseConfig.firestoreDatabaseId)
      : getFirestore(app);
}

export const db = firestoreInstance;

export enum OperationType {
  CREATE = 'create',
  UPDATE = 'update',
  DELETE = 'delete',
  LIST = 'list',
  GET = 'get',
  WRITE = 'write',
}

export interface FirestoreErrorInfo {
  error: string;
  operationType: OperationType;
  path: string | null;
  authInfo: {
    userId?: string | null;
    email?: string | null;
    emailVerified?: boolean | null;
    isAnonymous?: boolean | null;
    tenantId?: string | null;
    providerInfo?: {
      providerId?: string | null;
      email?: string | null;
    }[];
  };
}

/**
 * Standard Firestore error handler conforming to AI Studio Security Diagnostic requirements.
 * When permissions fail, throws diagnostic JSON. For transient offline/connectivity states,
 * logs a notice and allows offline cache fallback without halting the UI.
 */
export function handleFirestoreError(
  error: unknown,
  operationType: OperationType,
  path: string | null
): void {
  const errMsg = error instanceof Error ? error.message : String(error);
  const errCode = (error as { code?: string })?.code || '';
  const isPermissionError =
    errCode === 'permission-denied' ||
    errMsg.includes('permission') ||
    errMsg.includes('Missing or insufficient permissions');

  const errInfo: FirestoreErrorInfo = {
    error: errMsg,
    authInfo: {
      userId: auth.currentUser?.uid,
      email: auth.currentUser?.email,
      emailVerified: auth.currentUser?.emailVerified,
      isAnonymous: auth.currentUser?.isAnonymous,
      tenantId: auth.currentUser?.tenantId,
      providerInfo:
        auth.currentUser?.providerData?.map((provider) => ({
          providerId: provider.providerId,
          email: provider.email,
        })) || [],
    },
    operationType,
    path,
  };

  if (isPermissionError) {
    console.error('Firestore Permission Error: ', JSON.stringify(errInfo));
    throw new Error(JSON.stringify(errInfo));
  } else {
    console.warn('Firestore Operation Notice: ', JSON.stringify(errInfo));
  }
}

const CONFIG_DOC_PATH = 'restaurant_config';
const CONFIG_DOC_ID = 'main';
const MENU_COLLECTION_PATH = 'menu_items';

/**
 * Real-time listener for Restaurant Configuration (delivery fee, address, phone, working hours, etc.)
 */
export function subscribeToRestaurantConfig(
  onUpdate: (config: RestaurantConfig) => void,
  onError?: (err: Error) => void
) {
  const fullPath = `${CONFIG_DOC_PATH}/${CONFIG_DOC_ID}`;
  const docRef = doc(db, CONFIG_DOC_PATH, CONFIG_DOC_ID);
  return onSnapshot(
    docRef,
    (snapshot) => {
      if (snapshot.exists()) {
        onUpdate(snapshot.data() as RestaurantConfig);
      }
    },
    (error) => {
      console.warn('Real-time config sync error:', error);
      if (onError && error instanceof Error) onError(error);
      handleFirestoreError(error, OperationType.GET, fullPath);
    }
  );
}

/**
 * Real-time listener for Menu Items across all categories
 */
export function subscribeToMenuItems(
  onUpdate: (items: MenuItem[]) => void,
  onError?: (err: Error) => void
) {
  const colRef = collection(db, MENU_COLLECTION_PATH);
  return onSnapshot(
    colRef,
    (snapshot) => {
      if (!snapshot.empty) {
        const items: MenuItem[] = [];
        snapshot.forEach((docSnap) => {
          items.push(docSnap.data() as MenuItem);
        });
        onUpdate(items);
      }
    },
    (error) => {
      console.warn('Real-time menu sync error:', error);
      if (onError && error instanceof Error) onError(error);
      handleFirestoreError(error, OperationType.LIST, MENU_COLLECTION_PATH);
    }
  );
}

/**
 * Save restaurant configuration directly to cloud Firestore.
 * Triggers instant real-time updates for all customers everywhere!
 */
export async function saveRestaurantConfigToCloud(config: RestaurantConfig) {
  const fullPath = `${CONFIG_DOC_PATH}/${CONFIG_DOC_ID}`;
  try {
    const docRef = doc(db, CONFIG_DOC_PATH, CONFIG_DOC_ID);
    await setDoc(docRef, config, { merge: true });
    return true;
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, fullPath);
    return false;
  }
}

/**
 * Save or update a single menu item in Firestore.
 */
export async function saveMenuItemToCloud(item: MenuItem) {
  const fullPath = `${MENU_COLLECTION_PATH}/${item.id}`;
  try {
    const docRef = doc(db, MENU_COLLECTION_PATH, item.id);
    await setDoc(docRef, item, { merge: true });
    return true;
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, fullPath);
    return false;
  }
}

/**
 * Delete a menu item from Firestore.
 */
export async function deleteMenuItemFromCloud(itemId: string) {
  const fullPath = `${MENU_COLLECTION_PATH}/${itemId}`;
  try {
    const docRef = doc(db, MENU_COLLECTION_PATH, itemId);
    await deleteDoc(docRef);
    return true;
  } catch (error) {
    handleFirestoreError(error, OperationType.DELETE, fullPath);
    return false;
  }
}

/**
 * Seed initial restaurant data into Firestore if not yet populated.
 */
export async function seedCloudDataIfEmpty(
  defaultConfig: RestaurantConfig,
  defaultItems: MenuItem[]
) {
  try {
    const configRef = doc(db, CONFIG_DOC_PATH, CONFIG_DOC_ID);
    const configSnap = await getDoc(configRef);
    if (!configSnap.exists()) {
      await setDoc(configRef, defaultConfig);
    }

    const menuColRef = collection(db, MENU_COLLECTION_PATH);
    const menuSnap = await getDocs(menuColRef);
    if (menuSnap.empty && defaultItems.length > 0) {
      const batch = writeBatch(db);
      defaultItems.forEach((item) => {
        const itemRef = doc(db, MENU_COLLECTION_PATH, item.id);
        batch.set(itemRef, item);
      });
      await batch.commit();
    }
  } catch (error) {
    console.warn('Could not seed initial cloud data:', error);
  }
}
