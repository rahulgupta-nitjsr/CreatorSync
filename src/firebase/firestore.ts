import {
  collection,
  doc,
  setDoc,
  getDoc,
  getDocs,
  updateDoc,
  deleteDoc,
  query,
  where,
  orderBy,
  limit,
  startAfter,
  QueryConstraint,
  DocumentData,
  DocumentReference,
  DocumentSnapshot,
  QuerySnapshot,
  serverTimestamp,
  Timestamp,
  onSnapshot
} from 'firebase/firestore';
import { db } from './config';

/**
 * Firebase Firestore service
 * Handles basic CRUD operations and querying
 */

/**
 * Create a new document or overwrite an existing one
 * @param collectionPath Path to the collection
 * @param docId Document ID (optional, Firestore will generate one if not provided)
 * @param data Document data
 * @returns DocumentReference
 */
export const createDocument = async <T extends DocumentData>(
  collectionPath: string,
  data: T,
  docId?: string
): Promise<DocumentReference<DocumentData>> => {
  const collectionRef = collection(db, collectionPath);
  const docRef = docId ? doc(collectionRef, docId) : doc(collectionRef);
  
  // Add timestamps
  const dataWithTimestamps = {
    ...data,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp()
  };
  
  await setDoc(docRef, dataWithTimestamps);
  return docRef;
};

/**
 * Get a document by ID
 * @param collectionPath Path to the collection
 * @param docId Document ID
 * @returns DocumentSnapshot
 */
export const getDocument = async (
  collectionPath: string,
  docId: string
): Promise<DocumentSnapshot<DocumentData>> => {
  const docRef = doc(db, collectionPath, docId);
  return getDoc(docRef);
};

/**
 * Update an existing document
 * @param collectionPath Path to the collection
 * @param docId Document ID
 * @param data Document data to update
 */
export const updateDocument = async <T extends DocumentData>(
  collectionPath: string,
  docId: string,
  data: Partial<T>
): Promise<void> => {
  const docRef = doc(db, collectionPath, docId);
  
  // Add updated timestamp
  const dataWithTimestamp = {
    ...data,
    updatedAt: serverTimestamp()
  };
  
  return updateDoc(docRef, dataWithTimestamp);
};

/**
 * Delete a document
 * @param collectionPath Path to the collection
 * @param docId Document ID
 */
export const deleteDocument = async (
  collectionPath: string,
  docId: string
): Promise<void> => {
  const docRef = doc(db, collectionPath, docId);
  return deleteDoc(docRef);
};

/**
 * Query documents in a collection
 * @param collectionPath Path to the collection
 * @param constraints Query constraints (where, orderBy, limit, etc.)
 * @returns QuerySnapshot
 */
export const queryDocuments = async (
  collectionPath: string,
  constraints: QueryConstraint[] = []
): Promise<QuerySnapshot<DocumentData>> => {
  const collectionRef = collection(db, collectionPath);
  const q = query(collectionRef, ...constraints);
  return getDocs(q);
};

/**
 * Subscribe to a document's real-time updates
 * @param collectionPath Path to the collection
 * @param docId Document ID
 * @param callback Function to call when document changes
 * @returns Unsubscribe function
 */
export const subscribeToDocument = (
  collectionPath: string,
  docId: string,
  callback: (doc: DocumentSnapshot<DocumentData>) => void
): (() => void) => {
  const docRef = doc(db, collectionPath, docId);
  return onSnapshot(docRef, callback);
};

/**
 * Subscribe to a query's real-time updates
 * @param collectionPath Path to the collection
 * @param constraints Query constraints
 * @param callback Function to call when query results change
 * @returns Unsubscribe function
 */
export const subscribeToQuery = (
  collectionPath: string,
  constraints: QueryConstraint[] = [],
  callback: (snapshot: QuerySnapshot<DocumentData>) => void
): (() => void) => {
  const collectionRef = collection(db, collectionPath);
  const q = query(collectionRef, ...constraints);
  return onSnapshot(q, callback);
};

// Export query helper functions for convenience
export {
  where,
  orderBy,
  limit,
  startAfter,
  serverTimestamp,
  Timestamp
}; 