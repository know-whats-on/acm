/**
 * Media storage layer — IndexedDB backend.
 * Stores file data URLs in IndexedDB so we can handle files up to 25 MB
 * without hitting the ~5 MB localStorage cap.
 */

export interface MediaFile {
  id: string;
  name: string;
  mimeType: string;
  size: number; // bytes
  createdAt: string; // ISO
}

const DB_NAME = 'wildlife-media-db';
const DB_VERSION = 1;
const STORE_NAME = 'media';

/* ── IndexedDB helpers ── */

function openDB(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    const req = indexedDB.open(DB_NAME, DB_VERSION);
    req.onupgradeneeded = () => {
      const db = req.result;
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        db.createObjectStore(STORE_NAME);
      }
    };
    req.onsuccess = () => resolve(req.result);
    req.onerror = () => reject(req.error);
  });
}

async function idbGet(key: string): Promise<string | null> {
  const db = await openDB();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(STORE_NAME, 'readonly');
    const store = tx.objectStore(STORE_NAME);
    const req = store.get(key);
    req.onsuccess = () => resolve((req.result as string) ?? null);
    req.onerror = () => reject(req.error);
    tx.oncomplete = () => db.close();
  });
}

async function idbSet(key: string, value: string): Promise<void> {
  const db = await openDB();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(STORE_NAME, 'readwrite');
    const store = tx.objectStore(STORE_NAME);
    store.put(value, key);
    tx.oncomplete = () => { db.close(); resolve(); };
    tx.onerror = () => { db.close(); reject(tx.error); };
  });
}

async function idbDelete(key: string): Promise<void> {
  const db = await openDB();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(STORE_NAME, 'readwrite');
    const store = tx.objectStore(STORE_NAME);
    store.delete(key);
    tx.oncomplete = () => { db.close(); resolve(); };
    tx.onerror = () => { db.close(); reject(tx.error); };
  });
}

/* ── Migration: move any existing localStorage media into IndexedDB ── */

let migrationDone = false;

async function migrateFromLocalStorage(): Promise<void> {
  if (migrationDone) return;
  migrationDone = true;
  const MEDIA_PREFIX = 'wildlife-media-';
  const keys = Object.keys(localStorage).filter(k => k.startsWith(MEDIA_PREFIX));
  if (keys.length === 0) return;
  const db = await openDB();
  const tx = db.transaction(STORE_NAME, 'readwrite');
  const store = tx.objectStore(STORE_NAME);
  for (const key of keys) {
    const val = localStorage.getItem(key);
    if (val) {
      // Store using the key without the prefix is wrong — keep the same key structure
      store.put(val, key);
    }
  }
  await new Promise<void>((resolve, reject) => {
    tx.oncomplete = () => { db.close(); resolve(); };
    tx.onerror = () => { db.close(); reject(tx.error); };
  });
  // Remove from localStorage after successful migration
  for (const key of keys) {
    localStorage.removeItem(key);
  }
}

// Kick off migration immediately on module load
const migrationPromise = migrateFromLocalStorage().catch(err => {
  console.warn('Media migration from localStorage failed:', err);
});

/* ── Image processing helpers ── */

function generateMediaId(): string {
  return `m-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;
}

const MEDIA_PREFIX = 'wildlife-media-';

/** Compress an image to fit within maxDim and return a JPEG data URL */
function compressImage(dataUrl: string, maxDim = 1200, quality = 0.75): Promise<string> {
  return new Promise((resolve) => {
    const img = new Image();
    img.onload = () => {
      let { width, height } = img;
      if (width > maxDim || height > maxDim) {
        const ratio = Math.min(maxDim / width, maxDim / height);
        width = Math.round(width * ratio);
        height = Math.round(height * ratio);
      }
      const canvas = document.createElement('canvas');
      canvas.width = width;
      canvas.height = height;
      const ctx = canvas.getContext('2d')!;
      ctx.drawImage(img, 0, 0, width, height);
      resolve(canvas.toDataURL('image/jpeg', quality));
    };
    img.onerror = () => resolve(dataUrl); // fallback
    img.src = dataUrl;
  });
}

/** Generate a small thumbnail (200px) */
function generateThumbnail(dataUrl: string): Promise<string> {
  return compressImage(dataUrl, 200, 0.6);
}

/** Read a File as a data URL */
function readFile(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

/** Generate a thumbnail from a video file */
function generateVideoThumbnail(dataUrl: string): Promise<string> {
  return new Promise((resolve) => {
    const video = document.createElement('video');
    video.muted = true;
    video.preload = 'metadata';
    video.onloadeddata = () => {
      video.currentTime = Math.min(1, video.duration * 0.1);
    };
    video.onseeked = () => {
      const canvas = document.createElement('canvas');
      const w = Math.min(video.videoWidth, 200);
      const h = Math.round((w / video.videoWidth) * video.videoHeight);
      canvas.width = w;
      canvas.height = h;
      const ctx = canvas.getContext('2d')!;
      ctx.drawImage(video, 0, 0, w, h);
      resolve(canvas.toDataURL('image/jpeg', 0.6));
    };
    video.onerror = () => resolve('');
    // Timeout fallback
    setTimeout(() => resolve(''), 3000);
    video.src = dataUrl;
  });
}

/* ── Public API ── */

/** Process & store a file, returning its MediaFile metadata + thumbnail */
export async function storeMediaFile(file: File): Promise<{ media: MediaFile; thumbnailUrl: string }> {
  await migrationPromise; // ensure migration is done first
  const id = generateMediaId();
  let rawDataUrl = await readFile(file);
  let thumbnailUrl = '';

  const isImage = file.type.startsWith('image/');
  const isVideo = file.type.startsWith('video/');

  if (isImage) {
    rawDataUrl = await compressImage(rawDataUrl);
    thumbnailUrl = await generateThumbnail(rawDataUrl);
  } else if (isVideo) {
    thumbnailUrl = await generateVideoThumbnail(rawDataUrl);
  }

  // Store the full data URL in IndexedDB
  try {
    await idbSet(MEDIA_PREFIX + id, rawDataUrl);
    if (thumbnailUrl) {
      await idbSet(MEDIA_PREFIX + id + '-thumb', thumbnailUrl);
    }
  } catch (e) {
    console.warn('Media storage failed:', e);
    throw new Error('Storage is full. Try removing some old entries or using smaller files.');
  }

  const media: MediaFile = {
    id,
    name: file.name,
    mimeType: file.type,
    size: file.size,
    createdAt: new Date().toISOString(),
  };

  return { media, thumbnailUrl };
}

/** Get the full data URL for a media item */
export async function getMediaDataUrl(mediaId: string): Promise<string | null> {
  await migrationPromise;
  return idbGet(MEDIA_PREFIX + mediaId);
}

/** Get the thumbnail data URL for a media item */
export async function getMediaThumbnail(mediaId: string): Promise<string | null> {
  await migrationPromise;
  return idbGet(MEDIA_PREFIX + mediaId + '-thumb');
}

/** Delete a media item from storage */
export async function deleteMediaFile(mediaId: string): Promise<void> {
  await migrationPromise;
  await idbDelete(MEDIA_PREFIX + mediaId);
  await idbDelete(MEDIA_PREFIX + mediaId + '-thumb');
}

/** Delete all media for a list of media files */
export async function deleteAllMediaFiles(mediaFiles: MediaFile[]): Promise<void> {
  for (const mf of mediaFiles) {
    await deleteMediaFile(mf.id);
  }
}

/** Format file size for display */
export function formatFileSize(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

/** Check if a mimeType is an image */
export function isImageType(mimeType: string): boolean {
  return mimeType.startsWith('image/');
}

/** Check if a mimeType is a video */
export function isVideoType(mimeType: string): boolean {
  return mimeType.startsWith('video/');
}

/** Export all media entries from IndexedDB as a key-value map */
export async function exportAllMedia(): Promise<Record<string, string>> {
  await migrationPromise;
  const db = await openDB();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(STORE_NAME, 'readonly');
    const store = tx.objectStore(STORE_NAME);
    const result: Record<string, string> = {};
    const req = store.openCursor();
    req.onsuccess = () => {
      const cursor = req.result;
      if (cursor) {
        result[cursor.key as string] = cursor.value as string;
        cursor.continue();
      }
    };
    tx.oncomplete = () => { db.close(); resolve(result); };
    tx.onerror = () => { db.close(); reject(tx.error); };
  });
}

/** Import media entries into IndexedDB from a key-value map */
export async function importAllMedia(data: Record<string, string>): Promise<void> {
  await migrationPromise;
  const db = await openDB();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(STORE_NAME, 'readwrite');
    const store = tx.objectStore(STORE_NAME);
    for (const [key, value] of Object.entries(data)) {
      store.put(value, key);
    }
    tx.oncomplete = () => { db.close(); resolve(); };
    tx.onerror = () => { db.close(); reject(tx.error); };
  });
}

/** Clear all media from IndexedDB */
export async function clearAllMedia(): Promise<void> {
  await migrationPromise;
  const db = await openDB();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(STORE_NAME, 'readwrite');
    const store = tx.objectStore(STORE_NAME);
    store.clear();
    tx.oncomplete = () => { db.close(); resolve(); };
    tx.onerror = () => { db.close(); reject(tx.error); };
  });
}