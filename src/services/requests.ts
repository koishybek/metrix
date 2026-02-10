import { db, storage } from '../firebase';
import { 
  collection, 
  addDoc, 
  query, 
  where, 
  getDocs, 
  serverTimestamp, 
  orderBy, 
  updateDoc,
  doc
} from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';

export interface ServiceRequest {
  id: string;
  userId: string;
  userPhone: string;
  type: 'verification' | 'repair' | 'consultation' | 'seal' | 'account_attach' | 'reading_submit' | 'other';
  status: 'new' | 'processing' | 'completed' | 'cancelled';
  details: string;
  createdAt: any;
  meterSerial?: string;
  photoUrl?: string;
  reading?: number;
}

export const uploadPhoto = async (file: File, path: string): Promise<string> => {
  let attempts = 0;
  const maxAttempts = 3;

  while (attempts < maxAttempts) {
    try {
      const storageRef = ref(storage, path);
      
      // Increased timeout to 90 seconds per attempt
      const timeoutPromise = new Promise<never>((_, reject) => {
        setTimeout(() => reject(new Error('Upload timed out')), 90000);
      });

      // Using uploadBytes for simplicity with Blob/File
      const snapshot = await Promise.race([
        uploadBytes(storageRef, file),
        timeoutPromise
      ]);

      const downloadURL = await getDownloadURL(snapshot.ref);
      return downloadURL;
    } catch (error) {
      attempts++;
      console.error(`Upload attempt ${attempts} failed:`, error);
      
      if (attempts >= maxAttempts) {
        throw error;
      }
      // Wait 1 second before retrying
      await new Promise(resolve => setTimeout(resolve, 1000));
    }
  }
  throw new Error('All upload attempts failed');
};

export const createServiceRequest = async (
  userId: string, 
  userPhone: string,
  type: ServiceRequest['type'], 
  details: string,
  meterSerial?: string,
  photoUrl?: string,
  reading?: number
) => {
  try {
    await addDoc(collection(db, 'service_requests'), {
      userId,
      userPhone,
      type,
      status: 'new',
      details,
      meterSerial: meterSerial || null,
      photoUrl: photoUrl || null,
      reading: reading || null,
      createdAt: serverTimestamp()
    });
  } catch (error) {
    console.error("Error creating request:", error);
    throw error;
  }
};

export const getUserRequests = async (userId: string): Promise<ServiceRequest[]> => {
  try {
    const q = query(
      collection(db, 'service_requests'), 
      where('userId', '==', userId),
      orderBy('createdAt', 'desc')
    );
    const querySnapshot = await getDocs(q);
    
    return querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    } as ServiceRequest));
  } catch (error) {
    console.error("Error getting user requests:", error);
    throw error;
  }
};

export const getAllRequests = async (): Promise<ServiceRequest[]> => {
  try {
    // Note: ordering by createdAt desc requires an index in Firestore if combined with where clauses,
    // but for getAll we usually just want all.
    const q = query(
      collection(db, 'service_requests'),
      orderBy('createdAt', 'desc')
    );
    const querySnapshot = await getDocs(q);
    
    return querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    } as ServiceRequest));
  } catch (error) {
    console.error("Error getting all requests:", error);
    throw error;
  }
};

export const updateRequestStatus = async (requestId: string, status: ServiceRequest['status']) => {
  try {
    const ref = doc(db, 'service_requests', requestId);
    await updateDoc(ref, { status });
  } catch (error) {
    console.error("Error updating request:", error);
    throw error;
  }
};
