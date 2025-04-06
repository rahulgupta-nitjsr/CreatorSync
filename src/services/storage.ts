import {
  ref,
  uploadBytesResumable,
  getDownloadURL,
  deleteObject,
  listAll,
  UploadTaskSnapshot
} from 'firebase/storage';
import { storage } from '@/firebase/config';

export interface IUploadProgressCallback {
  (snapshot: UploadTaskSnapshot): void;
}

/**
 * Upload a file to Firebase Storage
 * @param {File} file - The file to upload
 * @param {string} path - Storage path (e.g., 'users/user123/profile.jpg')
 * @param {IUploadProgressCallback} progressCallback - Optional callback for upload progress
 * @returns {Promise<string>} Download URL
 */
export const uploadFile = async (
  file: File,
  path: string,
  progressCallback?: IUploadProgressCallback
): Promise<string> => {
  try {
    const storageRef = ref(storage, path);
    const uploadTask = uploadBytesResumable(storageRef, file);
    
    if (progressCallback) {
      uploadTask.on('state_changed', progressCallback);
    }
    
    // Wait for the upload to complete
    await new Promise<void>((resolve, reject) => {
      uploadTask.on(
        'state_changed',
        () => {}, // Already handled by progressCallback
        (error) => reject(error),
        () => resolve()
      );
    });
    
    // Get the download URL
    const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
    return downloadURL;
  } catch (error) {
    console.error('Error uploading file:', error);
    throw error;
  }
};

/**
 * Delete a file from Firebase Storage
 * @param {string} path - Storage path to the file
 * @returns {Promise<void>}
 */
export const deleteFile = async (path: string): Promise<void> => {
  try {
    const storageRef = ref(storage, path);
    await deleteObject(storageRef);
  } catch (error) {
    console.error('Error deleting file:', error);
    throw error;
  }
};

/**
 * Generate a unique file path for storage
 * @param {string} userId - User ID
 * @param {string} fileName - Original file name
 * @param {string} contentType - Type of content (e.g., 'profile', 'content')
 * @returns {string} Unique storage path
 */
export const generateFilePath = (
  userId: string,
  fileName: string,
  contentType: string
): string => {
  const timestamp = Date.now();
  const extension = fileName.split('.').pop();
  return `${contentType}/${userId}/${timestamp}-${Math.random().toString(36).substring(2, 9)}.${extension}`;
};

/**
 * Helper function to get the file path from a download URL
 * @param {string} downloadURL - Firebase Storage download URL
 * @returns {string | null} File path or null if it can't be extracted
 */
export const getFilePathFromURL = (downloadURL: string): string | null => {
  try {
    // Extract the path from the URL
    const baseStorageUrl = 'https://firebasestorage.googleapis.com/v0/b/';
    const pathStart = downloadURL.indexOf(baseStorageUrl) + baseStorageUrl.length;
    const pathEnd = downloadURL.indexOf('?', pathStart);
    
    if (pathStart === -1 || pathEnd === -1) {
      return null;
    }
    
    let fullPath = downloadURL.substring(pathStart, pathEnd);
    
    // Find the part after the bucket name
    const bucketEndIndex = fullPath.indexOf('/o/');
    if (bucketEndIndex === -1) {
      return null;
    }
    
    const path = fullPath.substring(bucketEndIndex + 3);
    
    // Decode the URL-encoded path
    return decodeURIComponent(path);
  } catch (error) {
    console.error('Error extracting file path from URL:', error);
    return null;
  }
};

/**
 * Upload a profile image
 * @param {File} file - Image file
 * @param {string} userId - User ID
 * @param {IUploadProgressCallback} progressCallback - Optional callback for upload progress
 * @returns {Promise<string>} Download URL
 */
export const uploadProfileImage = async (
  file: File,
  userId: string,
  progressCallback?: IUploadProgressCallback
): Promise<string> => {
  const path = generateFilePath(userId, file.name, 'profiles');
  return uploadFile(file, path, progressCallback);
};

/**
 * Upload content media (image, video, etc.)
 * @param {File} file - Media file
 * @param {string} userId - User ID
 * @param {string} contentId - Content ID
 * @param {IUploadProgressCallback} progressCallback - Optional callback for upload progress
 * @returns {Promise<string>} Download URL
 */
export const uploadContentMedia = async (
  file: File,
  userId: string,
  contentId: string,
  progressCallback?: IUploadProgressCallback
): Promise<string> => {
  const path = `content/${userId}/${contentId}/${file.name}`;
  return uploadFile(file, path, progressCallback);
};

/**
 * Upload content media (image, video, etc.) specifically for a new content item.
 * Generates a unique path based on user ID and timestamp.
 * @param {File} file - Media file
 * @param {string} userId - User ID
 * @param {IUploadProgressCallback} progressCallback - Optional callback for upload progress
 * @returns {Promise<string>} Download URL
 */
export const uploadContentFile = async (
  file: File,
  userId: string,
  progressCallback?: IUploadProgressCallback
): Promise<string> => {
  // Generate a unique path like content/<userId>/<timestamp>-<random>.<ext>
  const path = generateFilePath(userId, file.name, 'content');
  console.log(`Uploading content file to: ${path}`); // Logging for debug
  return uploadFile(file, path, progressCallback);
};

/**
 * List all files in a directory
 * @param {string} directoryPath - Path to the directory
 * @returns {Promise<string[]>} Array of download URLs
 */
export const listFiles = async (directoryPath: string): Promise<string[]> => {
  try {
    const directoryRef = ref(storage, directoryPath);
    const listResult = await listAll(directoryRef);
    
    const downloadURLs: string[] = [];
    for (const item of listResult.items) {
      const url = await getDownloadURL(item);
      downloadURLs.push(url);
    }
    
    return downloadURLs;
  } catch (error) {
    console.error('Error listing files:', error);
    throw error;
  }
}; 